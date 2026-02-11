interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
    sendToAdmins?: boolean;
}
export declare const sendEmail: ({ to, subject, text, html, sendToAdmins }: EmailOptions) => Promise<void>;
export {};
//# sourceMappingURL=sendEmail.d.ts.map