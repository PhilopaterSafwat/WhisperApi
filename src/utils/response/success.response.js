export const successRes = ({ res, message = "Done", data = {}, status = 200 } = {}) => {
    return res.status(status).json({ successMessage: message, data: { ...data } })
}