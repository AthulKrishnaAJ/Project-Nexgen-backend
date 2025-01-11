function generateOtp(): string {
    const otp = Math.floor(1000 + Math.random() * 8000)
    return `${otp}`
}

export default generateOtp