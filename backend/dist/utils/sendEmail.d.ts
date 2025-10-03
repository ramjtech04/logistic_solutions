interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}
export declare const sendEmail: ({ to, subject, text, html }: EmailOptions) => Promise<void>;
export {};
//# sourceMappingURL=sendEmail.d.ts.map