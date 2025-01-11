import bcrypt from 'bcrypt'

export const hashPassword =  async (password: string): Promise<string> => {
    try {
        let saltRoundes = 10
        const salt = await bcrypt.genSalt(saltRoundes);
        const hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword   
    } catch (error: any) {
        console.error('Error in hasing passwor at password service file at service: ', error.message)
        throw new Error('Password hashing error')
    }
}