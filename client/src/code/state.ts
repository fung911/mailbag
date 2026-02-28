import * as IMAP from "./IMAP";
import * as Contacts from "./Contacts";
import { config } from "./config";
import * as SMTP from "./SMTP";

let stateSingleton: any = null;
export function createState(inParentComponent: React.Component<any, any>): any {

    if (stateSingleton === null) {
        stateSingleton = {
            pleaseWaitVisible: false,
            contacts: [],
            mailboxes: [],

            messages: [],
            currentView: "welcome",
            currentMailbox: null,

            messageID: null,
            messageDate: null,
            messageSubject: null,
            messageFrom: null,
            messageTo: null,
            messageBody: null,

            contactID: null,
            contactName: null,
            contactEmail: null,


            showHidePleaseWait: function (inVisible: boolean): void {
                inParentComponent.setState(() => ({ pleaseWaitVisible: inVisible }));
            },

            addMailboxToList: function (inMailbox: IMAP.IMailbox): void {
                inParentComponent.setState(prevState => ({
                    mailboxes: [...prevState.mailboxes,
                        inMailbox]
                }));
            },

            addContactToList: function (inContact: Contacts.IContact): void {
                inParentComponent.setState(prevState => ({
                    contacts: [...prevState.contacts,
                        inContact]
                }));
            },

            showComposeMessage: function (inType: string): void {
                switch (inType) {
                    case "new":
                        inParentComponent.setState(() => ({
                            currentView: "compose", messageTo: "", messageSubject: "",
                            messageBody: "",
                            messageFrom: config.userEmail
                        }));
                        break;
                    case "reply":
                        inParentComponent.setState(() => ({
                            currentView: "compose", messageTo: inParentComponent.state.messageFrom,
                            messageSubject: `Re: ${inParentComponent.state.messageSubject}`,
                        }));
                        break;
                    case "contact":
                        inParentComponent.setState(() => ({
                            currentView: "compose", messageTo: inParentComponent.state.contactEmail,
                            messageSubject: "", messageBody: "",
                            messageFrom: config.userEmail
                        }));
                        break;
                }
            },
            showAddContact: function (): void {
                inParentComponent.setState(() => ({
                    currentView: "contactAdd", contactID: null, contactName: "",
                    contactEmail: ""
                }));
            },
            setCurrentMailbox: function (inPath: String): void {
                inParentComponent.setState(() => ({
                    currentView: "welcome", currentMailbox:
                        inPath
                }));
                inParentComponent.state.getMessages(inPath);
            },

            getMessages: async function (inPath: string): Promise<void> {
                inParentComponent.state.showHidePleaseWait(true);
                const imapWorker: IMAP.Worker = new IMAP.Worker();
                const messages: IMAP.IMessage[] = await imapWorker.listMessages(inPath);
                inParentComponent.state.showHidePleaseWait(false);
                inParentComponent.state.clearMessages();
                messages.forEach((inMessage: IMAP.IMessage) => {
                    inParentComponent.state.addMessageToList(inMessage);
                });
            },

            clearMessages: function (): void {
                inParentComponent.setState(() => ({ messages: [] }));
            },

            addMessageToList: function (inMessage: IMAP.IMessage): void {
                inParentComponent.setState(prevState => ({
                    messages: [...prevState.messages,
                        inMessage]
                }));
            },

            showContact: function (inID: string, inName: string, inEmail:
                string): void {
                inParentComponent.setState(() => ({
                    currentView: "contact", contactID: inID, contactName: inName,
                    contactEmail: inEmail
                }));
            },

            fieldChangeHandler: function (inEvent: any): void {
                if (inEvent.target.id === "contactName" &&
                    inEvent.target.value.length > 16) { return; }
                inParentComponent.setState({
                    [inEvent.target.id]:
                        inEvent.target.value
                });
            },

            saveContact: async function (): Promise<void> {
                const cl = inParentComponent.state.contacts.slice(0);
                inParentComponent.state.showHidePleaseWait(true);
                const contactsWorker: Contacts.Worker = new Contacts.Worker();
                const contact: Contacts.IContact = await contactsWorker.addContact({
                    name: inParentComponent.state.contactName,
                    email: inParentComponent.state.contactEmail
                });
                inParentComponent.state.showHidePleaseWait(false);
                cl.push(contact);
                inParentComponent.setState(() => ({
                    contacts: cl, contactID: null, contactName: "",
                    contactEmail: ""
                }));
            },

            deleteContact: async function (): Promise<void> {
                inParentComponent.state.showHidePleaseWait(true);
                const contactsWorker: Contacts.Worker = new Contacts.Worker();
                await contactsWorker.deleteContact(inParentComponent.state.contactID);
                inParentComponent.state.showHidePleaseWait(false);
                const cl = inParentComponent.state.contacts.filter(
                    (inElement) => inElement._id != inParentComponent.state.contactID
                );
                inParentComponent.setState(() => ({
                    contacts: cl, contactID: null, contactName: "",
                    contactEmail: ""
                }));
            },

            showMessage: async function (inMessage: IMAP.IMessage): Promise<void> {
                inParentComponent.state.showHidePleaseWait(true);
                const imapWorker: IMAP.Worker = new IMAP.Worker();
                const mb: String = await imapWorker.getMessageBody(
                    inMessage.id, inParentComponent.state.currentMailbox
                );
                inParentComponent.state.showHidePleaseWait(false);
                inParentComponent.setState(() => ({
                    currentView: "message", messageID: inMessage.id, messageDate:
                        inMessage.date, messageFrom: inMessage.from,
                    messageTo: "", messageSubject: inMessage.subject, messageBody: mb
                }));
            },

            sendMessage: async function (): Promise<void> {
                inParentComponent.state.showHidePleaseWait(true);
                const smtpWorker: SMTP.Worker = new SMTP.Worker();
                await smtpWorker.sendMessage(inParentComponent.state.messageTo,
                    inParentComponent.state.messageFrom, inParentComponent.state.messageSubject,
                    inParentComponent.state.messageBody
                );
                inParentComponent.state.showHidePleaseWait(false);
                inParentComponent.setState(() => ({ currentView: "welcome" }));
            },

            deleteMessage: async function (): Promise<void> {
                inParentComponent.state.showHidePleaseWait(true);
                const imapWorker: IMAP.Worker = new IMAP.Worker();
                await imapWorker.deleteMessage(
                    inParentComponent.state.messageID, inParentComponent.state.currentMailbox
                );
                inParentComponent.state.showHidePleaseWait(false);
                const cl = inParentComponent.state.messages.filter(
                    (inElement) => inElement.id != inParentComponent.state.messageID
                );
                inParentComponent.setState(() => ({ messages: cl, currentView: "welcome" }));
            }
        };
    }
    return stateSingleton;
}

export function getState(): any {
    return stateSingleton;
} /* End getState(). */


