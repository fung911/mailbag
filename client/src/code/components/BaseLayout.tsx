import React from "react";
import { Component } from "react";
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { createState } from "../state";
import Toolbar from "./Toolbar";
import MailboxList from "./MailboxList";
import MessageList from "./MessageList";
import WelcomeView from "./WelcomeView";
import MessageView from "./MessageView";
import ContactView from "./ContactView";
import ContactList from "./ContactList";

class BaseLayout extends Component {
    state: any = createState(this);
    render(): JSX.Element {
        return (
            <div className="appContainer">
                <Dialog open={this.state.pleaseWaitVisible} disableEscapeKeyDown={true}
                    transitionDuration={0}
                    onClose={(inEvent, inReason) => {
                        if (inReason !== "backdropClick") {
                            this.state.showHidePleaseWait(false);
                        }
                    }}
                >
                    <DialogTitle style={{ textAlign: "center" }}>Please Wait</DialogTitle>
                    <DialogContent><DialogContentText>...Contacting server...
                    </DialogContentText></DialogContent>
                </Dialog>
                <div className="toolbar">
                    <Toolbar state={this.state} />
                </div>
                <div className="mailboxList">
                    <MailboxList state={this.state} />
                </div>
                <div className="centerArea">
                    <div className="messageList">
                        <MessageList state={this.state} />
                    </div>
                    <div className="centerViews">
                        {this.state.currentView === "welcome" && <WelcomeView />}
                        {(this.state.currentView === "message" ||
                            this.state.currentView === "compose") &&
                            <MessageView state={this.state} />
                        }
                        {(this.state.currentView === "contact" ||
                            this.state.currentView === "contactAdd") &&
                            <ContactView state={this.state} />
                        }
                    </div>
                </div>
                <div className="contactList">
                    <ContactList state={this.state} />
                </div>
            </div>

        );
    }
}

export default BaseLayout;