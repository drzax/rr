import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.scss";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubHeader from "@material-ui/core/ListSubHeader";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import Logout from "../Logout";

export default class MainMenu extends React.Component {
  state = { open: false, formData: {} };
  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleInputChange = ({ target }) => {
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;

    this.setState({
      formData: {
        ...this.state.formData,
        [name]: value
      }
    });
  };

  render() {
    const { open, formData } = this.state;
    const { username, className, isAnonymous, handleLogin } = this.props;
    return (
      <div className={className}>
        <IconButton
          color="inherit"
          aria-label="Open menu"
          onClick={this.handleDrawerOpen}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          open={open}
          classes={{ paper: styles.drawer }}
          onClose={this.handleDrawerClose}
        >
          <List
            subheader={
              <ListSubHeader>Hello {isAnonymous ? "" : username}</ListSubHeader>
            }
          >
            {isAnonymous ? (
              <div>
                <ListItem>
                  Dang—we don't know your email address. That means if you log
                  out, it's gone forever.
                </ListItem>
                <ListItem>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    name="email"
                    label="Email address"
                    type="email"
                    variant="outlined"
                    value={formData.email || ""}
                    onChange={this.handleInputChange}
                    fullWidth
                  />
                  <Button
                    className={styles.loginButton}
                    onClick={() => handleLogin(formData.email)}
                    color="primary"
                    size="small"
                    disabled={!(formData.email && formData.email.length > 3)}
                  >
                    Make it permanent
                  </Button>
                </ListItem>
              </div>
            ) : null}
          </List>
          <Divider />
          <List>
            <Logout component={ListItem} componentProps={{ button: true }}>
              <ListItemText primary="Logout" />
            </Logout>
          </List>
        </Drawer>
      </div>
    );
  }
}

MainMenu.propTypes = {
  username: PropTypes.string.isRequired,
  isAnonymous: PropTypes.bool.isRequired
};
