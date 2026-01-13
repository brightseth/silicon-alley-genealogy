import { Resend } from 'resend';

// Initialize Resend lazily to avoid build-time errors when key is missing
let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const FROM_EMAIL = 'Silicon Alley <noreply@siliconalley.nyc>';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://silicon-alley-genealogy.vercel.app';

/**
 * Send confirmation email when someone submits their story
 */
export async function sendSubmissionConfirmation(
  email: string,
  name: string
): Promise<boolean> {
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Thanks for sharing your story, ${name}!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a; font-size: 24px;">Your story has been submitted!</h1>
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
            Hi ${name},
          </p>
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
            Thank you for sharing your Silicon Alley story. We're preserving the history of NYC's first tech scene, and your contribution helps tell that story.
          </p>
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
            Your submission is being reviewed. Once approved, you'll receive an email with a link to claim your Pioneer Card NFT.
          </p>
          <p style="color: #888; font-size: 14px; margin-top: 40px;">
            — The Silicon Alley Archive Team
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send submission confirmation:', error);
    return false;
  }
}

/**
 * Send claim email when a story is approved
 */
export async function sendClaimEmail(
  email: string,
  name: string,
  personId: string,
  claimToken: string
): Promise<boolean> {
  const claimUrl = `${BASE_URL}/claim/${personId}?token=${claimToken}`;

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `🎉 Your Pioneer Card is ready to claim, ${name}!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a; font-size: 24px;">Your Pioneer Card is ready!</h1>
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
            Hi ${name},
          </p>
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
            Your Silicon Alley story has been approved, and your Pioneer Card is ready to mint. Click below to claim your free NFT:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${claimUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Claim Your Pioneer Card
            </a>
          </div>
          <p style="color: #4a4a4a; font-size: 14px; line-height: 1.6;">
            <strong>What you get:</strong>
          </p>
          <ul style="color: #4a4a4a; font-size: 14px; line-height: 1.8;">
            <li>A unique NFT on the Base network</li>
            <li>100 $ALLEY tokens as a thank you</li>
            <li>Your place in Silicon Alley history, forever</li>
          </ul>
          <p style="color: #888; font-size: 14px; margin-top: 40px;">
            — The Silicon Alley Archive Team
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send claim email:', error);
    return false;
  }
}

/**
 * Send celebration email after NFT is minted
 */
export async function sendNFTMintedEmail(
  email: string,
  name: string,
  openseaUrl: string,
  transactionHash: string
): Promise<boolean> {
  const basescanUrl = `https://basescan.org/tx/${transactionHash}`;

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `🏆 ${name}, your Pioneer Card is on-chain!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a; font-size: 24px;">You're officially on-chain!</h1>
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
            Hi ${name},
          </p>
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
            Congratulations! Your Silicon Alley Pioneer Card has been minted to the Base blockchain. Your story is now permanently preserved on-chain.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${openseaUrl}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin-right: 10px;">
              View on OpenSea
            </a>
          </div>
          <p style="color: #4a4a4a; font-size: 14px; line-height: 1.6;">
            <strong>Share your card:</strong> Let people know you were part of Silicon Alley history! Others can mint editions of your card to collect.
          </p>
          <p style="color: #888; font-size: 12px; margin-top: 40px;">
            <a href="${basescanUrl}" style="color: #888;">View transaction on BaseScan</a>
          </p>
          <p style="color: #888; font-size: 14px;">
            — The Silicon Alley Archive Team
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send NFT minted email:', error);
    return false;
  }
}
