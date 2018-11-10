import React from "react";
import styles from "./styles.scss";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Logout from "../Logout";

export default class MainMenu extends React.Component {
  state = { open: false };
  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;
    const { username, className } = this.props;
    return (
      <div className={className}>
        <IconButton
          color="inherit"
          aria-label="Open menu"
          onClick={this.handleDrawerOpen}
        >
          <MenuIcon />
        </IconButton>
        <Drawer open={open} onClose={this.handleDrawerClose}>
          <List>
            <ListItem>
              <ListItemText primary={username} />
            </ListItem>
            <Divider />
            <Logout component={ListItem} componentProps={{ button: true }}>
              <ListItemText primary="Logout" />
            </Logout>
          </List>
        </Drawer>
      </div>
    );
  }
}
