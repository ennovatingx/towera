import type { LegalDocument, LegalDocumentType } from '@/types/studio';

// Baseline content, in the markdown-lite syntax parsed by src/lib/markdownLite.tsx.
// This is what ships in the bundle and is shown until an Admin edits it (via
// /studio/admin/legal) or a real backend document is fetched — see src/api/legal.ts.
const PRIVACY_CONTENT = `This Privacy Policy explains what personal data Towera collects when you visit this website or contribute to Towera Studio, why we collect it, and the rights you have over it under the Nigeria Data Protection Act 2023 (“NDPA”).

## 1. Who we are
Towera (“Towera”, “we”, “us”) is a Nigerian-language data platform operated by **[Company legal name — to be confirmed]**. For the purposes of the NDPA, Towera acts as the **data controller** for personal data processed through this website and Towera Studio, located at [towera.ennovatingx.com](https://towera.ennovatingx.com/).

## 2. Who this policy applies to
This policy covers three kinds of people:
- **Visitors** browsing the public Towera website.
- **Contributors** who create a Towera Studio account to submit text translations and voice recordings.
- **Reviewers and Admins** who use Towera Studio to manage languages, phrases, and submissions.

## 3. Personal data we collect
### Account data
- Username, email address, and password (stored hashed, never in plain text).
- Your assigned role — Contributor, Reviewer, or Admin.

### Contribution data
- Text translations you submit for a given phrase and language.
- Voice recordings you make of yourself reading a phrase aloud, captured through your browser's microphone.
- Metadata about a submission — timestamps, the language/dialect selected, and its review status.

### Payout data
- Bank name, account number, and the resolved account name you provide when adding a payout account, used solely to send you earnings for approved contributions.
- A history of your payout requests and their status (pending, in review, approved).

### Usage data
- IP address, browser type, and device information, collected automatically for security and reliability.

## 4. Legal basis for processing
Under the NDPA, we rely on the following legal bases:
- **Consent** — for recording your voice and for any processing that is not strictly necessary to run your account, we ask for your informed, affirmative, specific consent before we process the data. You can withdraw this consent at any time; see Section 8.
- **Performance of a contract** — to create and run your Towera Studio account, review your submissions, and pay out earnings for approved work.
- **Legitimate interest** — to secure the platform, prevent fraud and abuse, and keep basic usage logs.

## 5. How we use your data
- To create and administer your Towera Studio account and enforce role-based access.
- To review, approve, or reject submitted translations and recordings.
- To compile approved contributions into structured Nigerian-language datasets.
- To train, fine-tune, and evaluate AI and machine-learning models — both for Towera's own products and for datasets or models Towera licenses to third parties, strictly within the scope you agreed to in the [Terms of Service](/terms).
- To calculate and process payouts for approved contributions.
- To send you service messages about your account or submissions.
- To investigate misuse and keep the platform secure.

## 6. Voice recordings are treated as sensitive data
A recording of your voice can, on its own, be used to identify you — so we treat it with the same care as sensitive personal data. We only record audio after you take an affirmative action to start recording, and only for the stated purpose of building a Nigerian-language speech dataset. We do not use your voice recordings to infer or profile characteristics about you (e.g. health, ethnicity, or emotional state).

## 7. Where your data is stored
Account and submission records are stored in a PostgreSQL database operated by Towera. Audio recordings are stored in Amazon Web Services (AWS) S3, uploaded directly from your browser using short-lived, pre-signed upload URLs. **[AWS region to be confirmed]**. Where personal data is transferred outside Nigeria — for example because a cloud region is located abroad — we rely on the safeguards permitted under the NDPA's cross-border transfer rules (including contractual protections with our processors) before doing so.

## 8. Your rights
Under the NDPA, you have the right to:
- **Access** the personal data we hold about you.
- **Correct** inaccurate or incomplete data.
- **Withdraw consent** at any time, without affecting the lawfulness of processing carried out before withdrawal.
- **Request erasure** of your personal account information (see Section 9 for what this does and does not cover).
- **Restrict or object to** certain processing of your data.
- **Request a copy** of your data in a portable format.
- **Lodge a complaint** with the Nigeria Data Protection Commission (NDPC) if you believe your data has been mishandled.

To exercise any of these rights, contact us at [privacy@towera.ennovatingx.com](mailto:privacy@towera.ennovatingx.com).

## 9. Data retention and deletion
If you delete your account or ask us to erase your personal data, we will remove or anonymize your account information (username, email, bank details) within a reasonable time, subject to any legal obligation to keep financial records for tax or anti-money-laundering purposes.

Text and audio you contributed that has already been **approved** and incorporated into a licensed dataset is handled differently. As explained in the [Terms of Service](/terms), that content is pooled anonymously with other contributors' work, and once a dataset has been compiled or a model trained on it, it is not technically possible to remove your specific contribution from it. Deleting your account removes your identity from that content going forward; it does not retroactively pull already-distributed datasets back from parties Towera has licensed them to. Submissions that have **not yet been approved** can be withdrawn at any time before review.

## 10. Who we share data with
- **Amazon Web Services (AWS)** — hosts our audio storage (S3).
- **Paystack** — used to look up Nigerian bank lists and resolve/verify bank account names before we send you a payout. Paystack only receives the bank code and account number needed to perform that check.
- We do not sell personal data. We do not share your contact details with dataset licensees.

## 11. Children
Towera Studio is intended for contributors aged 18 and above. We do not knowingly collect personal data from anyone under 18. If you believe a minor has created an account, contact us and we will remove it.

## 12. Security
We use industry-standard measures to protect your data, including encrypted connections (HTTPS), hashed passwords, role-based access control so that only Reviewers and Admins can see submission data relevant to their role, and short-lived pre-signed URLs for audio uploads rather than open storage access.

## 13. Regulatory registration
As Towera grows, we will assess whether we are required to register as a data controller or processor with the Nigeria Data Protection Commission (NDPC) under its registration framework, and will update this policy to reflect that status once determined.

## 14. Changes to this policy
We may update this policy as Towera Studio evolves. Material changes will be reflected by updating the “Last updated” date above, and where changes affect how we use content you already contributed, we will seek your fresh consent rather than relying on the updated policy alone.

## 15. Contact us
Questions about this policy or how your data is handled can be sent to [privacy@towera.ennovatingx.com](mailto:privacy@towera.ennovatingx.com).`;

const TERMS_CONTENT = `These Terms govern your use of Towera and Towera Studio. If you create a contributor account, Section 6 (Contributor License) is the most important part — it explains exactly what you're agreeing Towera can do with the translations and recordings you submit.

## 1. Acceptance of these terms
By creating a Towera Studio account or otherwise using this website, you agree to be bound by these Terms and by our [Privacy Policy](/privacy). If you do not agree, do not use the platform.

## 2. Eligibility
You must be at least 18 years old and legally able to enter into a binding contract under Nigerian law to create a Towera Studio account.

## 3. What Towera Studio is
Towera Studio is a data-collection platform with three roles:
- **Contributors** submit text translations of phrases and, optionally, voice recordings of themselves reading those phrases.
- **Reviewers** check submissions for accuracy and approve or reject them.
- **Admins** manage languages, dialects, and phrases, and export the resulting datasets.

## 4. Your account
You agree to provide accurate registration information, to keep your login credentials confidential, and to use one account per person. You're responsible for activity that happens under your account.

## 5. Consent to record your voice
If you choose to submit an audio recording, you do so voluntarily and affirmatively — recording only starts when you actively trigger it. By submitting an audio recording, you confirm that the voice in the recording is your own (or, if not, that you have that person's explicit permission to submit it on their behalf), and you consent to Towera processing that recording as described in Section 6 and in our [Privacy Policy](/privacy).

## 6. Contributor license — what Towera can do with your submissions
By submitting a text translation or audio recording that is subsequently **approved** by a Reviewer, you grant Towera a worldwide, royalty-free (beyond any payout owed to you under Section 7), non-exclusive, sublicensable license to:
- use the submitted text for research and for training, fine-tuning, and evaluating language models;
- use the submitted audio for training, fine-tuning, and evaluating speech models;
- build commercial AI products and models — including models Towera licenses or sells to third parties — using datasets that include your approved contribution;
- compile, publish, and redistribute the resulting dataset to Towera's customers, partners, or the public, with your contribution pooled and anonymized alongside other contributors' work rather than attributed to you individually.

This license is **non-exclusive** — you're free to reuse or resubmit the same translation elsewhere. Towera does not claim ownership of the underlying phrase or your copyright in your specific wording; you're granting a license to use it, not transferring ownership of it.

### Retention after you leave
Because approved contributions are pooled into shared datasets — and because models may already have been trained on a dataset that includes your contribution — Towera may continue to use and retain your approved contributions even after you close your account or ask us to delete your personal information. Deleting your account removes your personal identity from our systems going forward; it does not retroactively remove your specific contribution from datasets or models already compiled or distributed. You can withdraw any submission that has **not yet been approved** at any time, with no lasting effect.

## 7. Payments for approved contributions
Each phrase is assigned a weight by an Admin, which determines the payout for an approved translation of that phrase (currently scaled between ₦100 and ₦1,000). You earn this amount only once a Reviewer **approves** your translation — pending and rejected submissions earn nothing.
- To withdraw earnings, you add a payout bank account (verified via Paystack's bank-name lookup) and submit a payout request, which moves through pending → in review → approved.
- Towera uses a third-party payment processor to verify bank details and disburse funds and is not responsible for delays caused by that processor or by your bank.
- Towera may withhold or reverse a payout if a submission is later found to be fraudulent, plagiarized, not your own original work, or otherwise submitted in violation of these Terms.

## 8. Content standards
You agree not to:
- submit text or audio that infringes someone else's copyright, including material copied from a book, article, or website without the rights to do so;
- submit a recording of someone else's voice without their explicit permission;
- submit offensive, hateful, or deliberately false translations;
- use bots, scripts, or automated tools to generate or submit content;
- create multiple accounts to inflate your submissions or earnings;
- provide false bank account details.

You represent that any text or audio you submit is either your own original work or content you have full rights to submit, consistent with the Nigeria Copyright Act 2022.

## 9. Reviewers and Admins
If you act as a Reviewer or Admin, you agree to review submissions honestly and in good faith, and to treat any personal data you can access through that role (such as another user's submission history) as confidential — not to be copied, shared, or used outside your duties on the platform.

## 10. Towera's intellectual property
The Towera name, logo, website, and platform (excluding the specific contributor content licensed to us under Section 6) are owned by Towera. These Terms don't grant you any rights to our brand or software.

## 11. Termination
You may stop using Towera Studio and close your account at any time. We may suspend or terminate accounts that violate these Terms, including submitting fraudulent content or attempting to manipulate payouts. Section 6 (Contributor License) survives termination for any content already approved before termination.

## 12. Disclaimers
Towera Studio is provided “as is” while it is under active development. We don't guarantee uninterrupted availability, and we don't guarantee that every submitted translation is linguistically perfect — that's what the review process is for.

## 13. Limitation of liability
To the maximum extent permitted under Nigerian law, Towera is not liable for indirect, incidental, or consequential damages arising from your use of the platform, including delays in payout processing caused by third parties.

## 14. Governing law
These Terms are governed by the laws of the Federal Republic of Nigeria. Any dispute arising from these Terms will first be addressed through good-faith negotiation before either party pursues formal legal proceedings in a Nigerian court of competent jurisdiction.

## 15. Changes to these terms
We may update these Terms as the platform evolves. If a change would affect how we're allowed to use content you already submitted, we will seek your fresh, informed consent rather than relying on the updated Terms alone to expand our rights over past contributions.

## 16. Contact us
Questions about these Terms can be sent to [legal@towera.ennovatingx.com](mailto:legal@towera.ennovatingx.com).`;

const LICENSES_CONTENT = `This page explains how organizations can license structured Nigerian-language datasets from Towera, and what the resulting license does and doesn't permit. It governs **dataset customers** — companies, universities, and AI labs licensing data from Towera. If you're a Contributor submitting translations or recordings, the contributor license terms are in Section 6 of our [Terms of Service](/terms) instead.

## 1. What this covers
Towera collects, verifies, and structures datasets — text, speech, translation, and annotation data — across Nigerian languages including Yoruba, Igbo, Hausa, and others. When a dataset (or access to it) is licensed to you under a **Towera Data License**, this page describes the standard terms of that license unless a signed agreement between you and Towera says otherwise, in which case the signed agreement controls.

## 2. License tiers
Towera offers a small number of standard license tiers, scoped by use case:
- **Research & Academic License** — for non-commercial research, evaluation, and academic publication, at reduced or no cost, subject to attribution.
- **Commercial License** — for use in commercial products and services, including training, fine-tuning, and evaluating AI models offered to your own customers.
- **Enterprise License** — a negotiated agreement for high-volume, exclusive, or custom data needs, which may include dedicated collection, custom annotation schemas, or exclusivity windows.

The specific tier, dataset scope, and fees for your license are set out in your order form, invoice, or signed agreement with Towera.

## 3. What you're permitted to do
Unless your specific agreement says otherwise, a Towera Data License permits you to:
- use the licensed data to train, fine-tune, evaluate, and benchmark machine learning and AI models;
- integrate outputs of models trained on the licensed data into your own commercial products and services;
- make internal copies of the licensed data reasonably necessary for your engineering, security, and backup workflows.

## 4. What you're not permitted to do
Unless your agreement explicitly grants it, you may not:
- resell, sublicense, or redistribute the licensed data itself (in raw or lightly-modified form) as a standalone dataset product to a third party;
- attempt to re-identify, de-anonymize, or single out any individual contributor from the dataset;
- represent that Towera endorses your product, or use the Towera name or logo in your marketing without our prior written permission;
- use the data for a purpose prohibited under Nigerian law or under the purpose restrictions (if any) stated in your order form.

## 5. Dataset composition and quality
Licensed datasets are compiled from contributions submitted through Towera Studio and approved through our review process (see [Terms of Service](/terms), Section 6). We structure and quality-check data before licensing it, but datasets are provided **"as is"** — we don't guarantee that a dataset is free of errors, exhaustive for your use case, or perfectly balanced across every dialect or demographic. Section 8 below limits our liability for this.

## 6. Attribution
Research & Academic License holders are asked to credit Towera in any resulting publication or model card (for example: "Trained in part on Nigerian-language data licensed from Towera"). Commercial and Enterprise License holders are not required to publicly attribute Towera unless your agreement says otherwise, but may not claim the data as originally collected by you.

## 7. Fees, delivery, and updates
Fees, payment terms, and delivery format (e.g. API access, bulk export) are set out in your order form or invoice. Where a license includes ongoing updates to a dataset (new contributions, corrections), we'll make reasonable efforts to deliver updates on the cadence agreed with you, but dataset composition may change over time as new contributions are reviewed and approved.

## 8. Warranty disclaimer and limitation of liability
Except as expressly stated in a signed agreement, licensed data is provided without warranties of any kind, express or implied, including fitness for a particular purpose. To the maximum extent permitted under Nigerian law, Towera's total liability arising from a data license is limited to the fees you paid for that license in the preceding twelve months, and Towera is not liable for indirect, incidental, or consequential damages, including outcomes of models trained on the licensed data.

## 9. Term and termination
A license runs for the term stated in your order form, or continues until terminated by either party as permitted there. If your license is terminated for breach of these terms, you must stop using newly-delivered data going forward; this does not require you to retroactively remove or retrain models already trained on data licensed before termination, unless your agreement says otherwise.

## 10. Changes to these terms
We may update these standard license terms as Towera's data offerings evolve. Changes apply to new licenses from that point forward; a license already signed is governed by the terms in effect when it was signed, unless both parties agree to the update.

## 11. Governing law
These terms are governed by the laws of the Federal Republic of Nigeria, consistent with our [Terms of Service](/terms) and [Privacy Policy](/privacy).

## 12. Contact us
To license a dataset, or with questions about an existing license, contact us at [licensing@towera.ennovatingx.com](mailto:licensing@towera.ennovatingx.com).`;

export const DEFAULT_LEGAL_DOCUMENTS: Record<LegalDocumentType, LegalDocument> = {
  privacy: {
    type: 'privacy',
    title: 'Privacy Policy',
    content: PRIVACY_CONTENT,
    updatedAt: '2026-08-06T00:00:00.000Z',
  },
  terms: {
    type: 'terms',
    title: 'Terms of Service',
    content: TERMS_CONTENT,
    updatedAt: '2026-08-06T00:00:00.000Z',
  },
  licenses: {
    type: 'licenses',
    title: 'Data Licenses',
    content: LICENSES_CONTENT,
    updatedAt: '2026-08-11T00:00:00.000Z',
  },
};
