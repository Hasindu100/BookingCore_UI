export interface ImageFile {
    id: number;
    url: string;
    file: any;
    filePath: string;
}

export interface User {
    firstName: string,
    lastName: string,
    publicName: string,
    profileImage: string,
    address: string,
    mobileNumber: string,
    email: string,
    city: {
        id: number
    },
    userLogin: {
        id: number
    }
}

export interface UserLogin {
    userName: string,
    password: string,
    userTypes: {
        id: number
    }
}