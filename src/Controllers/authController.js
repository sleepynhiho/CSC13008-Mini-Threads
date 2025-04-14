const bcrypt = require("bcrypt"); // hash password
const User = require("../Models/User"); // model user
const jwt = require("jsonwebtoken"); // token
const nodemailer = require("nodemailer"); // gửi email
const { LazyResult } = require("postcss");
const env = require("dotenv").config(); // biến môi trường
// GENERATE ACCESS TOKEN
generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    // key bí mật
    process.env.JWT_ACCESS_KEY,
    // hạn sử dụng token
    { expiresIn: "1h" }
  );
};
// GENERATE REFRESH TOKEN

generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    // key bí mật
    process.env.JWT_REFRESH_KEY,
    // hạn sử dụng token
    { expiresIn: "7d" }
  );
};
// ĐĂNG NHẬP
const loginController = async (req, res) => {
  try {
    // tìm user trong db

    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });
    // nếu không tìm thấy
    if (!user) {
      return res.status(404).json({ message: "Incorrect username or email." });
    }
    const email = user.email;

    // so sánh password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    // nếu sai password
    if (!validPassword) {
      return res.status(400).json({ message: "Incorrect password." });
    }
    // Kiểm tra trạng thái xác minh
    if (!user.is_verified) {
      // kiểm tra thời gian gửi email xác minh, token email trước đã hết hạn chưa
      if (
        user.verification_sent_at &&
        new Date() - new Date(user.verification_sent_at) < 60 * 60 * 1000
      ) {
        return res.status(400).json({
          message:
            "Account is not verified. Please check your mail! Verification email sent.",
        });
      }

      // gửi email xác minh
      const token = jwt.sign(
        { id: user._id, email: email },
        process.env.JWT_VERIFY_KEY,
        { expiresIn: "1h" }
      );
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        }
      });

      const verificationLink = `${process.env.API_URL}/auth/verify?token=${token}`;
      const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: email,
        subject: "Verify your email",
        html: `
                        <h2>Welcome to Our Service</h2>
                        <p>To complete your registration, please verify your email by clicking the link below:</p>
                        <a href="${verificationLink}">Verify Email</a>
                        <p>If you didn't register for this service, please ignore this email.</p>
                    `,
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending verification email:", error);
          return res
            .status(500)
            .json({ message: "Failed to send verification email" });
        }
        user.verification_sent_at = Date.now();
        res.status(200).json({
          message:
            // Account chưa được xác minh, đã gửi email xác minh, hãy xác minh để đăng nhập
            " Verification email sent. Please verify your email to login",
        });
      });
      return res
        .status(400)
        .json({ message: "Account is not verified. Please check your mail!" });
    }

    // nếu đúng cả username và password
    if (user && validPassword) {
      // tạo token
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // lưu trữ token
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // deploy chuyển thành true
        path: "/",
        // ngăn chặn CSRF
        sameSite: "strict",
      });
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, // deploy chuyển thành true
        path: "/",
        // ngăn chặn CSRF
        sameSite: "strict",
      });

      const { password, ...other } = user._doc;

      res.status(200).json({ ...other, accessToken, message: "Login success" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json(err);
  }
};

// ĐĂNG KÝ
const signupController = async (req, res) => {
  try {
    const { username, email, password, fullname } = req.body;

    // kiểm tra email tồn tại
    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // kiểm tra username tồn tại
    const usernameExist = await User.findOne({ username: username });
    if (usernameExist) {
      return res.status(400).json({ message: "Username already exists." });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);

    // tạo user mới
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashed,
      fullname: req.body.fullname,
    });
    // tạo token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_VERIFY_KEY, // Secret key
      { expiresIn: "1h" } // Thời gian hết hạn
    );
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const verificationLink = `${process.env.API_URL}/auth/verify?token=${token}`;
    const mailOptions = {
      from: process.env.MAIL_FROM_ADDRESS,
      to: email,
      subject: "Verify your email",
      html: `
                    <h2>Welcome to Mini Threads</h2>
                    <p>To complete your registration, please verify your email by clicking the link below:</p>
                    <a href="${verificationLink}">Verify Email</a>
                    <p>If you didn't register for this service, please ignore this email.</p>
                `,
    };

    await transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error("Error sending verification email:", error);
        return res
          .status(500)
          .json({ message: "Failed to send verification email" });
      }
      // cập nhật thời gian xác minh
      newUser.verification_sent_at = Date.now();
      // lưu vào db
      const user = await newUser.save();
      res.status(200).json({
        message:
          "Signup successful! Please verify your email to activate your account.",
      });
    });

    // trả về kết quả
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json(err);
  }
};

//REFRESH TOKEN
const requestRefreshToken = async (req, res) => {
  // Lấy refreshToken từ cookie
  const refreshToken = req.cookies.refreshToken;

  // Nếu không có refreshToken (chưa đăng nhập,...)
  if (!refreshToken)
    return res.status(401).json({ message: "You are not authenticated" });

  // Verify refreshToken
  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Token is not valid" });

    // không lỗi -> tạo token mới
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // lưu vào cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, // deploy chuyển thành true
      path: "/",
      // ngăn chặn CSRF
      sameSite: "strict",
    });

    // trả về token mới
    res.status(200).json({ accessToken: newAccessToken });
  });
};

// LOGOUT
const logoutController = async (req, res) => {
  // xóa cookie refreshToken
  res.clearCookie("refreshToken");

  // trả về kết quả
  res.status(200).json({ message: "Logged out successfully" });
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    // Tìm người dùng theo email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Tạo token để reset mật khẩu
    const token = jwt.sign({ id: user.id }, process.env.JWT_RESET_KEY, {
      // token hết hạn trong 1m
      expiresIn: "1h",
    });

    // Tạo transporter để gửi email
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD, // Mật khẩu của tài khoản Gmail hoặc sử dụng OAuth 2.0
      },
    });

    // Cấu hình nội dung email
    var mailOptions = {
      from: process.env.MAIL_FROM_ADDRESS,
      to: user.email,
      subject: "Reset password",
      html: `
                    <h2>We received a request to reset your password.</h2>
                    <p>Please click the link below to reset your password. The link will expire in 10 minutes.</p>
                    <p><a href="${process.env.API_URL}/auth/changePassword?email=${user.email}&token=${token}">Reset Password</a></p>
                
                    <p>If you didn't request a password reset, please ignore this email.</p>
                `,
    };

    // Gửi email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json("Failed to send email, please try again.");
      } else {
        res.status(200).json({ message: "Email sent successfully" });
      }
    });

    // Lưu trữ token vào cơ sở dữ liệu hoặc trong bộ nhớ, nếu cần thiết
    // Ví dụ: Bạn có thể lưu token vào một bảng riêng hoặc trong session
  } catch (err) {
    console.error("Error during reset password:", err);
    res.status(500).json({ error: err.message });
  }
};

// API để xử lý cập nhật mật khẩu mới
const updatePassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_RESET_KEY, async (err, decoded) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "The password change period has expired" });
      }

      // Tìm người dùng theo ID
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Hash mật khẩu mới
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Cập nhật mật khẩu trong cơ sở dữ liệu
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ error: err.message });
  }
};

// verify email
const verifyController = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Missing verification token" });
    }

    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_VERIFY_KEY);

    // Tìm user và cập nhật trạng thái
    const user = await User.findById(decoded.id);
    userid = user._id;
    email = user.email;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.is_verified) {
      return res.status(200).render("verify/verify", {
        message: "Account already verified",
        layout: false,
      });
    }

    user.is_verified = true;

    await user.save();

    return res.status(200).render("verify/verify", {
      message: "Your account has been successfully verified!",
      layout: false,
    });
  } catch (err) {
    console.error("Error verifying account:", err);

    return res.status(200).render("verify/verify_expired", {
      message: "Your account has been successfully verified!",
      layout: false,
    });
  }
};
module.exports = {
  loginController,
  signupController,
  requestRefreshToken,
  logoutController,
  resetPassword,
  updatePassword,
  verifyController,
};
