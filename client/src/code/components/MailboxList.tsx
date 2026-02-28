import { List, Chip } from "@mui/material";
import React from "react";
import { IMailbox } from "../IMAP";

const MailboxList = ({ state }): JSX.Element => (
    <List>
        {state.mailboxes.map((value: IMailbox) => {
            return (
                <Chip label={`${value.name}`} onClick={() =>
                    state.setCurrentMailbox(value.path)
                }
                    style={{ width: 128, marginBottom: 10 }}
                    color={state.currentMailbox === value.path ?
                        "secondary" : "primary"} />
            );
        })}
    </List>
);

export default MailboxList;