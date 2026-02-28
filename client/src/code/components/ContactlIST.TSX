import { List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import Person from "@mui/icons-material/Person";
import { IContact } from "../Contacts";
import React from "react";


const ContactList = ({ state }): JSX.Element => (
    <List>
        {state.contacts.map((value: IContact) => {
            return (
                <ListItem>
                    <ListItemButton
                        onClick={() =>
                            state.showContact(value._id,
                                value.name, value.email
                            )
                        }>
                        <ListItemAvatar>
                            <Avatar><Person /></Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={`${value.name}`} /></ListItemButton>
                </ListItem>
            );
        })}
    </List>
);

export default ContactList;