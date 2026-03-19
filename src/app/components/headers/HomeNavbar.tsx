import { Box, Button, Container, ListItemIcon, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";
import Basket from "./Basket";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { Menu, MenuItem } from "@mui/material";
import { Logout } from "@mui/icons-material";

interface HomeNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

export default function HomeNavbar(props: HomeNavbarProps) {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll, setLoginOpen, setSignupOpen, handleCloseLogout, handleLogoutClick, anchorEl, handleLogoutRequest } = props;
  const { authMember } = useGlobals();

  return (
    <div
      className="home-navbar"
      style={{ backgroundImage: "url('https://cdn.prod.website-files.com/66ec6afe3cc26899cbbb300a/66eddcbf29d527e056d8dceb_Hero%20Background-p-1600.jpg')" }}
    >
      {/* ── TOP MENU ── */}
      <Container className="navbar-container">
        <Stack className="menu">
          <Box>
            <NavLink to="/" activeClassName={"underline"}>
              <img className="brand-logo" src="/icons/velmora-logo.svg" alt="Velmora" />
            </NavLink>
          </Box>
          <Stack className="links">
            <Box className={"hover-line"}>
              <NavLink to="/" exact activeClassName={"underline"}>Home</NavLink>
            </Box>
            <Box className={"hover-line"}>
              <NavLink to="/products" activeClassName={"underline"}>Products</NavLink>
            </Box>
            <Box className={"hover-line"}>
              <NavLink to="/help" activeClassName={"underline"}>FAQ</NavLink>
            </Box>
            {authMember && (
              <Box className={"hover-line"}>
                <NavLink to="/orders" activeClassName={"underline"}>Orders</NavLink>
              </Box>
            )}
            {authMember && (
              <Box className={"hover-line"}>
                <NavLink to="/member-page" activeClassName={"underline"}>My Page</NavLink>
              </Box>
            )}
            <Basket
              cartItems={cartItems}
              onRemove={onRemove}
              onDelete={onDelete}
              onDeleteAll={onDeleteAll}
              onAdd={onAdd}
            />
            {!authMember ? (
              <Box>
                <Button variant="contained" className="login-button" onClick={() => setLoginOpen(true)}>
                  Login
                </Button>
              </Box>
            ) : (
              <img
                className="user-avatar"
                src={authMember?.memberImage
                  ? `${serverApi}/${authMember?.memberImage}`
                  : "/icons/default-user.svg"
                }
                aria-haspopup={"true"}
                onClick={handleLogoutClick}
              />
            )}

            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={Boolean(anchorEl)}
              onClose={handleCloseLogout}
              onClick={handleCloseLogout}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '&:before': {
                    content: '""', display: 'block', position: 'absolute',
                    top: 0, right: 14, width: 10, height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleLogoutRequest}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>
      </Container>

      {/* ── HERO TEXT — bottom-left over image ── */}
      <Container>
        <Stack className={"hero-bottom"}>
          <Box className={"hero-label"}>
            <span>More Products</span>
            <span className={"hero-label-sep"}>|</span>
            <NavLink to="/products">See more →</NavLink>
          </Box>
          <Box className={"head-main-txt"}>
            Your Next Adventure<br />Starts With Us
          </Box>
          {!authMember && (
            <Button className={"hero-sign-btn"} variant="contained" onClick={() => setSignupOpen(true)}>
              Sign Up
            </Button>
          )}
        </Stack>
      </Container>
    </div>
  );
}
