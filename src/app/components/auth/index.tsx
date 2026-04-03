import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const { signupOpen, loginOpen, handleSignupClose, handleLoginClose } = props;
  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { setAuthMember } = useGlobals();

  useEffect(() => {
    if (!signupOpen && !loginOpen) {
      setMemberNick("");
      setMemberPhone("");
      setMemberPassword("");
      setShowPassword(false);
    }
  }, [signupOpen, loginOpen]);

  const handleUsername = (e: T) => setMemberNick(e.target.value);
  const handlePhone = (e: T) => setMemberPhone(e.target.value);
  const handlePassword = (e: T) => setMemberPassword(e.target.value);

  const handlePasswordKeyDown = (e: T) => {
    if (e.key === "Enter" && signupOpen) handleSignupRequest().then();
    else if (e.key === "Enter" && loginOpen) handleLoginRequest().then();
  };

  const handleSignupRequest = async () => {
    try {
      const isFulfill = memberNick !== "" && memberPhone !== "" && memberPassword !== "";
      if (!isFulfill) throw new Error(Messages.error3);
      const signupInput: MemberInput = {
        memberNick,
        memberPhone,
        memberPassword,
      };
      const member = new MemberService();
      const result = await member.signup(signupInput);
      setAuthMember(result);
      handleSignupClose();
    } catch (err) {
      console.log(err);
      handleSignupClose();
      sweetErrorHandling(err).then();
    }
  };

  const handleLoginRequest = async () => {
    try {
      const isFulfill = memberNick !== "" && memberPassword !== "";
      if (!isFulfill) throw new Error(Messages.error3);
      const loginInput: LoginInput = {
        memberNick,
        memberPassword,
      };
      const member = new MemberService();
      const result = await member.login(loginInput);
      setAuthMember(result);
      handleLoginClose();
    } catch (err) {
      console.log(err);
      handleLoginClose();
      sweetErrorHandling(err).then();
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      fontFamily: "Poppins, sans-serif",
      fontSize: "14px",
      "& fieldset": { borderColor: "#E0E0E0" },
      "&:hover fieldset": { borderColor: "#0C0C0C" },
      "&.Mui-focused fieldset": { borderColor: "#0C0C0C", borderWidth: "1.5px" },
    },
    "& .MuiInputLabel-root": {
      fontFamily: "Poppins, sans-serif",
      fontSize: "14px",
      "&.Mui-focused": { color: "#0C0C0C" },
    },
  };

  const socialButtonSx = {
    borderRadius: "10px",
    border: "1.5px solid #E0E0E0",
    color: "#0C0C0C",
    fontFamily: "Poppins, sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    textTransform: "none",
    padding: "10px 0",
    gap: "10px",
    transition: "border-color 0.2s, background 0.2s",
    "&:hover": { borderColor: "#0C0C0C", background: "#F5F5F5" },
  };

  return (
    <>
      {/* ── SIGNUP ── */}
      <Dialog
        open={signupOpen}
        onClose={handleSignupClose}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            width: "440px",
            padding: "40px 40px 36px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <IconButton
          onClick={handleSignupClose}
          sx={{ position: "absolute", top: 16, right: 16, color: "#888" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Typography sx={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "24px", mb: 0.5 }}>
          Create account
        </Typography>
        <Typography sx={{ fontFamily: "Poppins", fontSize: "13px", color: "#888", mb: 3 }}>
          Join Baginy and start your journey
        </Typography>

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={memberNick}
            onChange={handleUsername}
            sx={inputSx}
          />
          <TextField
            fullWidth
            label="Phone number"
            variant="outlined"
            value={memberPhone}
            onChange={handlePhone}
            sx={inputSx}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={memberPassword}
            onChange={handlePassword}
            onKeyDown={handlePasswordKeyDown}
            sx={inputSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Button
          fullWidth
          variant="contained"
          onClick={handleSignupRequest}
          startIcon={<LoginIcon />}
          className="auth-signup-btn"
          sx={{
            mt: 3,
            borderRadius: "10px",
            background: "#FFFFFF",
            color: "#0C0C0C",
            border: "1.5px solid #0C0C0C",
            fontFamily: "Poppins",
            fontSize: "14px",
            fontWeight: 600,
            textTransform: "none",
            padding: "12px 0",
            boxShadow: "none",
            "&:hover": { background: "#0C0C0C", color: "#FFFFFF" },
          }}
        >
          Sign Up
        </Button>

        <Divider sx={{ my: 3, fontSize: "12px", color: "#888", fontFamily: "Poppins" }}>
          or continue with
        </Divider>

        <Stack spacing={1.5}>
          <Button
            fullWidth
            variant="outlined"
            sx={socialButtonSx}
            startIcon={
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={18} />
            }
          >
            Continue with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ ...socialButtonSx, borderColor: "#FEE500", "&:hover": { borderColor: "#e6cf00", background: "#FFFDE7" } }}
            startIcon={
              <Box sx={{ width: 18, height: 18, background: "#FEE500", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#3A1D1D" }}>K</Typography>
              </Box>
            }
          >
            Continue with Kakao
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ ...socialButtonSx, borderColor: "#1877F2", color: "#1877F2", "&:hover": { borderColor: "#1877F2", background: "#EEF4FF" } }}
            startIcon={
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" width={18} />
            }
          >
            Continue with Facebook
          </Button>
        </Stack>
      </Dialog>

      {/* ── LOGIN ── */}
      <Dialog
        open={loginOpen}
        onClose={handleLoginClose}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            width: "440px",
            padding: "40px 40px 36px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <IconButton
          onClick={handleLoginClose}
          sx={{ position: "absolute", top: 16, right: 16, color: "#888" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Typography sx={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "24px", mb: 0.5 }}>
          Welcome back
        </Typography>
        <Typography sx={{ fontFamily: "Poppins", fontSize: "13px", color: "#888", mb: 3 }}>
          Sign in to your Baginy account
        </Typography>

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={memberNick}
            onChange={handleUsername}
            sx={inputSx}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={memberPassword}
            onChange={handlePassword}
            onKeyDown={handlePasswordKeyDown}
            sx={inputSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Button
          fullWidth
          variant="contained"
          onClick={handleLoginRequest}
          startIcon={<LoginIcon />}
          className="auth-login-btn"
          sx={{
            mt: 3,
            borderRadius: "10px",
            background: "#FFFFFF",
            color: "#0C0C0C",
            border: "1.5px solid #0C0C0C",
            fontFamily: "Poppins",
            fontSize: "14px",
            fontWeight: 600,
            textTransform: "none",
            padding: "12px 0",
            boxShadow: "none",
            "&:hover": { background: "#0C0C0C", color: "#FFFFFF" },
          }}
        >
          Login
        </Button>

        <Divider sx={{ my: 3, fontSize: "12px", color: "#888", fontFamily: "Poppins" }}>
          or continue with
        </Divider>

        <Stack spacing={1.5}>
          <Button
            fullWidth
            variant="outlined"
            sx={socialButtonSx}
            startIcon={
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={18} />
            }
          >
            Continue with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ ...socialButtonSx, borderColor: "#FEE500", "&:hover": { borderColor: "#e6cf00", background: "#FFFDE7" } }}
            startIcon={
              <Box sx={{ width: 18, height: 18, background: "#FEE500", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#3A1D1D" }}>K</Typography>
              </Box>
            }
          >
            Continue with Kakao
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ ...socialButtonSx, borderColor: "#1877F2", color: "#1877F2", "&:hover": { borderColor: "#1877F2", background: "#EEF4FF" } }}
            startIcon={
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" width={18} />
            }
          >
            Continue with Facebook
          </Button>
        </Stack>
      </Dialog>
    </>
  );
}
