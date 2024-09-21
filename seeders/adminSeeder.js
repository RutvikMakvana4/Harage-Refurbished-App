import SubAdmin from "../model/subAdmin";

const data = [
    {
        fullName: 'Harage Admin',
        email: 'admin@mailinator.com',
        password: '$2a$12$nzBDN7GMldpS7HKJ.nMzAeoyC12003O97m.R524n68zLn2SwWKB5.',  //admin@123
        assignRoles: ["Administrator"]
    }
]

async function adminLoginData() {

    try {

        const findAdmin = await SubAdmin.findOne({ email: data[0].email })
        if (!findAdmin) {
            await SubAdmin.insertMany(data);
        }

    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

adminLoginData();