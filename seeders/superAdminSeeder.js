import SuperAdmin from "../model/superAdmin";

const superAdminData = [
    {
        fullName: "Super Admin",
        email: 'superadmin@mailinator.com',
        password: '$2a$12$5lWzoLwnyzIdUCZLqO376uLa7MhaKLUxnPi/WmebeZVRi2p.pwbW2'  //superadmin@123
    }
]

async function superAdminLoginData() {

    try {

        const findSuperAdmin = await SuperAdmin.findOne({ email: superAdminData[0].email })

        if (!findSuperAdmin) {
            await SuperAdmin.insertMany(superAdminData);
        }
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

superAdminLoginData();