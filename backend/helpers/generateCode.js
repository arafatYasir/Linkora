const generateCode = (length) => {
    let code = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()=+[]{}?";

    for(let i = 0; i < length; i++) {
        code += chars[Math.floor(Math.random() * chars.length)]
    }

    return code;
}

module.exports = generateCode;