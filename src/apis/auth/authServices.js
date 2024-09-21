import EmailVerification from "../../../model/emailVerification";
import commonService from "../../../utils/commonService";
import AccessToken from "../../../model/accessToken";
import RefreshToken from "../../../model/refreshToken";
import Users from "../../../model/users";
import Customer from "../../../model/stripeCustomer";
import RegisterResource from "./resources/registerResource";
import SocialResource from "./resources/socialResource";
import bcrypt from "bcrypt";
import twilio from "twilio"
import jwt from "jsonwebtoken";
import { sendMail } from "../../common/sendEmail";
import { BCRYPT, JWT } from "../../common/constants/constants";
import { randomStringGenerator, randomNumberGenerator, createUserLog } from "../../common/helper";
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException, ValidationError, InternalServerError } from "../../../src/common/exceptions/errorException";
import { baseUrl } from "../../common/constants/configConstants";
import Stripe from "stripe";
import FcmStore from "../../../model/fcmToken";
import PhoneVerification from "../../../model/phoneVerification";
import { OAuth2Client } from "google-auth-library";
import verifyAppleToken from "verify-apple-id-token";
import axios from "axios";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const googleClient = new OAuth2Client();

class authServices {

    /**
     * @description: Send OTP to Email
     * @param {*} data 
     * @param {*} res 
     * @returns 
     */
    static async sendOtpToEmail(data, res) {
        const { email } = data

        try {
            const OTP = await randomNumberGenerator(4)

            await commonService.createOne(EmailVerification, {
                email: email,
                emailOTP: OTP
            });

            const obj = {
                to: email,
                subject: `Welcome to ${process.env.APP_NAME}`,
                data: { OTP }
            }

            sendMail(obj, 'otpVerification');
        } catch (err) {
            throw new InternalServerError("something went wrong")
        }
    }




    /**
    * @description: Email OTP verification
    * @param {*} data 
    * @param {*} req 
    * @param {*} res 
    */
    static async emailVerifyOTP(data, req, res) {
        const { email, otp } = data;

        const findEmail = await commonService.findOne(EmailVerification, { email: email });

        if (otp == findEmail.emailOTP) {
            await commonService.findOneAndDelete(EmailVerification, { email: email })
        } else {
            throw new ConflictException("otp are not match")
        }
    }

    /**
     * @description: Send phone number OTP
     * @param {*} data 
     * @returns 
     */
    static async sendOtpToPhone(data) {
        const { email, countryCode, phone } = data;
        // try {

        const alreadyEmail = await commonService.findOne(Users, { email: email })

        if (alreadyEmail) {
            throw new ConflictException("This email id is already in used | please try different Email Id");
        }

        const findPhoneNumber = await commonService.findOne(Users, { countryCode: countryCode, phone: phone });
        // console.log(findPhoneNumber)

        if (findPhoneNumber) {
            throw new ConflictException("Phone number already has been taken")
        } else {

            const OTP = await randomNumberGenerator(4);
            // console.log(OTP)

            const sendOtpToPhone = await client.messages.create({
                from: process.env.TWILIO_PHONE_NUMBER,
                to: `${countryCode}${phone}`,
                body: `Your ${process.env.APP_NAME} verification code is ${OTP}.`,
            });
            // console.log(sendOtpToPhone)

            if (sendOtpToPhone) {
                const isOtpExit = await PhoneVerification.findOne({
                    countryCode: countryCode,
                    phone: phone
                });

                if (isOtpExit) {
                    const updateData = await PhoneVerification.findByIdAndUpdate(isOtpExit._id, {
                        countryCode: countryCode,
                        phone: phone,
                        phoneOTP: OTP
                    });
                    return updateData;
                } else {
                    const createData = await PhoneVerification.create({
                        countryCode: countryCode,
                        phone: phone,
                        phoneOTP: OTP
                    })
                    return createData;

                }

            } else {
                throw new ConflictException("OTP not send")
            }

        }

        // } catch (error) {
        //     console.log(error)
        // }

    }



    /**
     * @description : Verify phone otp
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async phoneVerifyOTP(data, req, res) {
        const { countryCode, phone, otp } = data;

        const findPhoneNumber = await PhoneVerification.findOne({
            $and: [
                { countryCode: countryCode },
                { phone: phone }
            ]
        })
        // console.log(findPhoneNumber)
        // console.log(findPhoneNumber.phoneOTP)

        if (findPhoneNumber) {
            if (otp == findPhoneNumber.phoneOTP) {
                await PhoneVerification.findOneAndDelete({
                    countryCode: countryCode,
                    phone: phone
                })
            } else {
                throw new BadRequestException("You entered OTP is not correct")
            }
        } else {
            throw new NotFoundException("Phone number not found")
        }
    }


    /**
     * @description : Register users to Harage refurbished e-commerce app
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     */
    static async register(data, req, res) {
        const { fullName, email, countryCode, phone, password, confirmPassword } = data;

        const alreadyEmail = await Users.findOne({ email: email })

        // if (alreadyEmail) {
        //     throw new ConflictException("This email id is already in used | please try different Email Id");
        // }

        const existEmail = await commonService.findOne(Users, { email: email, countryCode: countryCode, phone: phone });
        if (alreadyEmail) {
            throw new ConflictException("This email id is already in used | please try different Email Id");
        } else if (existEmail) {
            throw new ConflictException("This users is already register | please login here")
        } else {
            if (password === confirmPassword) {
                const hashPass = await bcrypt.hash(password, BCRYPT.SALT_ROUND);
                const usersRegister = await commonService.createOne(Users, {
                    fullName: fullName,
                    email: email,
                    countryCode: countryCode,
                    phone: phone,
                    password: hashPass,
                });

                // for stripe customer
                const customer = await stripe.customers.create({
                    name: usersRegister.fullName,
                    email: usersRegister.email
                });

                await commonService.createOne(Customer, {
                    userId: usersRegister._id,
                    customerId: customer.id
                });

                const authentication = await authServices.generateTokenPairs(usersRegister._id);

                // const link = baseUrl(`api/v1/auth/emailVerify?email=${email}`)
                // const obj = {
                //     to: email,
                //     subject: `Email verification in ${process.env.APP_NAME}`,
                //     data: { link }
                // }

                // sendMail(obj, 'emailVerification');

                return { ...new RegisterResource(usersRegister), authentication };
            } else {
                throw new ConflictException("Password or confirm Password are not match");
            }
        }
    }

    // /**
    //  * @description : email verify
    //  * @param {*} query 
    //  * @param {*} req 
    //  * @param {*} res 
    //  */
    // static async emailVerify(query, req, res) {
    //     const { email } = query;

    //     const findEmail = await Users.findOne({ email: email });

    //     if (findEmail) {
    //         await Users.findByIdAndUpdate(findEmail._id, {
    //             isVerify: true
    //         })
    //     }


    //     // return res.redirect(`process.env.DEEP_LINK`)
    // }


    /**
    * @description: Login
    * @param {*} data 
    * @param {*} req 
    * @param {*} res 
    */
    static async login(data, req, res) {
        const { email, password } = data
        const findUser = await commonService.findOne(Users, { email: email })
        if (!findUser) throw new NotFoundException("This email id is not registered. please register first")

        const isPasswordMatch = await bcrypt.compare(password, findUser.password);
        if (!isPasswordMatch) {
            createUserLog(findUser._id, req.ip, "Login", "Login Failed")
            throw new BadRequestException("Invalid password")
        }

        const authentication = await authServices.generateTokenPairs(findUser._id)

        createUserLog(findUser._id, req.ip, "Login", "Login Successfully")

        await Users.findByIdAndUpdate(findUser._id, {
            lastLogin : new Date()
        }, { new : true })

        return { ...new RegisterResource(findUser), authentication }

    }



    /**
     * @description: Logout users
     * @param {*} req 
     */
    static async logout(data, req) {
        const { deviceId } = data;
        const token = await req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.decode(token)
        const decodedData = await JSON.parse(decodedToken.data);
        const findToken = await commonService.findOne(AccessToken, { token: decodedData.jti });
        if (!findToken) {
            throw new UnauthorizedException("This access token is expired , please login !")
        }
        await commonService.findOneAndDelete(FcmStore, { deviceId: deviceId })
        await commonService.deleteById(AccessToken, { _id: findToken._id });
        await commonService.findOneAndDelete(RefreshToken, { accessToken: findToken.token });
        return
    }


    /**
     * @description: Forgot password link generate
     * @param {*} data 
     */
    static async forgotPassword(data) {
        const { email } = data;
        const findUser = await commonService.findOne(Users, { email: email });
        if (!findUser) {
            throw new NotFoundException("This email is not register");
        } else {
            const token = jwt.sign({ id: findUser._id }, JWT.SECRET, { expiresIn: 300 });
            const link = baseUrl(`api/v1/auth/forgotPage/${token}`);

            const obj = {
                to: email,
                subject: `Welcome to ${process.env.APP_NAME}`,
                data: { link }
            }

            await commonService.findOneAndUpdate(Users, findUser._id, {
                refKey: true
            });

            sendMail(obj, 'forgotPassword');
        }
    }



    /**
    * @description: Forgot password page load
    * @param {*} token 
    * @param {*} req 
    * @param {*} res 
    */
    static async forgotPage(token, req, res) {
        try {
            const verifyToken = jwt.verify(token, JWT.SECRET);
            const forgotRefKey = await commonService.findOne(Users, { _id: verifyToken.id });
            if (verifyToken) {
                return res.render('forgotPassword/resetPassword', { layout: "forgotPassword/resetPassword", "forgotPassRefKey": forgotRefKey })
            }
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(403).send({ message: "Your link has been expired" });
            }
            return res.status(403).send({ message: "Invalid token" });
        }
    }



    /**
     * @description: Resetpassword
     * @param {*} token 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     */
    static async resetPassword(token, data, req, res) {
        const { newPassword, confirmPassword } = data;
        const isValid = jwt.verify(token, JWT.SECRET);
        if (isValid) {
            if (newPassword == "" || confirmPassword == "") {
                req.flash('error', 'New Password and Confirm Password is required');
                return res.redirect("back");
            } else {
                if (newPassword.length < 8) {
                    req.flash('error', 'Your password needs to be at least 8 characters long');
                    return res.redirect("back");
                } else {
                    if (newPassword === confirmPassword) {
                        const hashPass = await bcrypt.hash(newPassword, BCRYPT.SALT_ROUND);
                        const findId = await commonService.updateById(Users, isValid.id, { password: hashPass, refKey: false });
                        if (findId) {
                            req.flash('success', 'Password has been changed');
                            return res.redirect('back');
                        }
                    } else {
                        req.flash('error', 'password and confirm password does not match');
                        return res.redirect('back');
                    }
                }
            }

        } else {
            req.flash('error', 'Link has been Expired');
            return res.redirect('back');
        }
    }



    /**
     * @description: Change Password
     * @param {*} data 
     * @param {*} auth 
     * @param {*} req 
     * @param {*} res 
     */
    static async changePassword(data, auth, req, res) {
        const { currentPassword, newPassword, confirmNewPassword } = data;

        if (currentPassword == "") {
            throw new ValidationError("current Password can`t be empty")
        }

        if (newPassword == "" && confirmNewPassword == "") {
            throw new ValidationError("New Password and confirm New Password cant be empty.")
        }

        if (newPassword != confirmNewPassword) {
            throw new ValidationError("New Password and confirm New Password not match")
        }

        const findUser = await commonService.findById(Users, { _id: auth })

        if (!findUser) {
            throw new NotFoundException("User not found")
        }

        const iscurrentPasswordCorrect = await bcrypt.compare(currentPassword, findUser.password)
        if (!iscurrentPasswordCorrect) {
            throw new BadRequestException("your current password is not correct please try again!!!")
        } else {
            const hashpass = await bcrypt.hash(newPassword, BCRYPT.SALT_ROUND);

            const changePassword = await commonService.updateById(Users, { _id: auth }, {
                password: hashpass
            })

            createUserLog(auth, req.ip, "Password changed", "User changed their login password")
        }
    }


    /**
     * @description : Social login (Google, Apple, Facebook)
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async socialLogin(data, req, res) {
        const { provider, token } = data;

        // try {
        if (provider === "0") {

            try {
                const googleClientAudience = [
                    process.env.GOOGLE_CLIENT_ID_ANDROID,
                    process.env.GOOGLE_CLIENT_ID_IOS
                ];

                const ticket = await googleClient.verifyIdToken({
                    idToken: token,
                    requiredAudience: googleClientAudience
                });

                const payload = ticket.getPayload();
                const audience = payload.aud;

                // if (!googleClientAudience.includes(audience)) {
                //     throw new Error(`Error while authenticating google user: audience mismatch`);
                // }

                const checkUser = await Users.findOne({ providerId: payload.sub, email: payload.email })

                if (checkUser) {
                    const getUser = await Users.findById({ _id: checkUser._id });
                    const authentication = await authServices.generateTokenPairs(getUser._id);

                    return { ...new SocialResource(getUser), authentication };

                } else {
                    const emailAlreadyExist = await Users.findOne({ email: payload.email })

                    if (emailAlreadyExist) {
                        return res.status(400).send({ message: "This email address has already been used" })
                    }
                    const saveUser = await Users.create({
                        providerId: payload.sub,
                        fullName: payload.name,
                        email: payload.email,
                        isSocial: true
                    })



                    const authentication = await authServices.generateTokenPairs(saveUser._id);

                    return { ...new SocialResource(saveUser), authentication };

                }
            } catch (error) {
                throw new ConflictException("Error while authenticating google user");
            }

        } else if (provider === "1") {

            try {

                const appleClientAudience = [
                    process.env.APPLE_CLIENT_ID_IOS,
                    process.env.APPLE_CLIENT_ID_ANDROID
                ];

                const applePayload = await verifyAppleToken({
                    idToken: token,
                    clientId: appleClientAudience
                })

                const checkUser = await Users.findOne({
                    $and: [
                        { providerId: applePayload.sub },
                        { email: applePayload.email }
                    ]
                })


                if (checkUser) {
                    const getUser = await Users.findById({ _id: checkUser._id });

                    const authentication = await authServices.generateTokenPairs(getUser._id);

                    return { ...new SocialResource(getUser), authentication };

                } else {

                    const emailAlreadyExist = await Users.findOne({ email: applePayload.email })

                    if (emailAlreadyExist) {
                        return res.status(400).send({ message: "This email address has already been used" })
                    }

                    const saveUser = await Users.create({
                        providerId: applePayload.sub,
                        email: applePayload.email,
                        isSocial: true
                    })

                    const authentication = await authServices.generateTokenPairs(saveUser._id);

                    return { ...new SocialResource(saveUser), authentication };
                }
            } catch (error) {
                throw new ConflictException("Error while authenticating apple user");
            }

        } else if (provider === "2") {

            try {
                const payload = await axios({
                    url: "https://graph.facebook.com/me",
                    method: "get",
                    params: {
                        fields: ["id", "email", "first_name", "last_name", "picture"].join(","),
                        access_token: token,
                    },
                });

                const checkUser = await Users.findOne({
                    $and: [
                        { providerId: payload.data.sub },
                        { email: payload.data.email }
                    ]
                })

                if (checkUser) {
                    const getUser = await Users.findById({ _id: checkUser._id });

                    const authentication = await authServices.generateTokenPairs(getUser._id);

                    return { ...new SocialResource(getUser), authentication };

                } else {

                    const emailAlreadyExist = await Users.findOne({ email: payload.data.email })

                    if (emailAlreadyExist) {
                        return res.status(400).send({ message: "This email address has already been used" })
                    }

                    const saveUser = await Users.create({
                        providerId: payload.data.sub,
                        fullName: payload.data.first_name + payload.data.last_name,
                        email: payload.data.email,
                        isSocial: true
                    })

                    const authentication = await authServices.generateTokenPairs(saveUser._id);

                    return { ...new SocialResource(saveUser), authentication };
                }
            } catch (error) {
                throw new ConflictException("Error while authenticating facebook user");
            }
        }
    }
    // } catch (error) {
    //     console.log(error, "error")
    // }

    /**
     * @description : genearte new access token
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async newAccessToken(data, req, res) {
        const { refreshToken } = data;
        console.log(data, "data")

        const authentication = await authServices.generateNewAccessToken(refreshToken)

        return { authentication };
    }




    /**
     * @description : Generate access token & refresh token
     * @param {user} authUser : logged user data
     * @returns access & refresh token
     */
    static async generateTokenPairs(authUser) {
        const { accessToken, expiresAt } = await this.generateAccessToken(authUser)
        if (accessToken) { var refreshToken = await this.generateRefreshToken(accessToken) }
        return { accessToken, refreshToken, expiresAt }
    }

    /**
     * @description : service to generate JWT token for authentication.
     * @param {obj} user : user who wants to login.
     * @return {string}  : returns access token.
     */
    static async generateAccessToken(user) {
        const jti = randomStringGenerator()
        const data = await JSON.stringify({ user, jti });
        const accessToken = jwt.sign({ data }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN });
        const decodedToken = jwt.decode(accessToken)

        await commonService.createOne(AccessToken, {
            token: jti,
            userId: user
        })
        return { accessToken, expiresAt: decodedToken.exp }
    };


    /**
     * @description : service to generate refresh token for authentication.
     * @param {string} accessToken : accessToken for refresh token.
     * @return {string}  : returns refresh token.
     */
    static async generateRefreshToken(accessToken) {
        const refreshToken = randomStringGenerator()
        const decodedToken = jwt.decode(accessToken)
        const accessJti = await JSON.parse(decodedToken.data);

        commonService.createOne(RefreshToken, {
            token: refreshToken,
            accessToken: accessJti.jti
        });
        return refreshToken
    };

    /**
     * @description : generate new access token
     * @param {*} refreshToken 
     */
    static async generateNewAccessToken(refreshToken) {
        const findRefreshToken = await RefreshToken.findOne({ token: refreshToken });

        if (!findRefreshToken) {
            throw new BadRequestException('Refresh token expired');
        }

        const findAccessToken = await AccessToken.findOne({ token: findRefreshToken.accessToken });

        if (!findAccessToken) {
            throw new BadRequestException('Access token expired');
        }

        const user = findAccessToken.userId;

        const deleteAccessToken = await AccessToken.findByIdAndDelete(findAccessToken._id)
        const deleteRefreshToken = await RefreshToken.findByIdAndDelete(findRefreshToken._id)

        return await this.generateTokenPairs(user)
    }
}

export default authServices;
