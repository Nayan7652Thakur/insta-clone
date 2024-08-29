import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {

  if (!token) {
    return res.status(401).json({
      message: 'User not Authenticated',
      success: false
    })

    const decode = await jwt.verify(token, process.env.SECRET_KEY)

    if (!decode) {
      return res.status(401).json({
        message: 'invaild',
        success: false
      })
    }

    req.id = decode.userId;

  }
}