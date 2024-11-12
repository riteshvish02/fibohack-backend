exports.sendtoken = (student, statusCode, res) => {
    const token = student.getjwttoken();
    const option = {
        exipers: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 1000 * 60 * 60 * 24
        ),
        httpOnly: true,
        // secure: true,

    }
    res.status(statusCode).cookie("token", token, option).json({success: true, id: student._id, token});
}