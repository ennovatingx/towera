import { Link } from 'react-router-dom';

interface ConsentModalProps {
  onAgree: () => void;
}

export default function ConsentModal({ onAgree }: ConsentModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground-950/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-background-50 p-6 md:p-8 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-5">
          <i className="ri-shield-check-line text-xl text-primary-600" />
        </div>
        <h2 className="font-heading text-xl font-semibold text-foreground-950 mb-3">Before you start translating</h2>
        <p className="text-sm text-foreground-600 leading-relaxed mb-4">
          Translations and voice recordings you submit and get <strong className="text-foreground-900 font-semibold">approved</strong> may
          be used to train AI language models and published as part of licensed Nigerian-language datasets. You'll
          earn a payout for each approved translation. Full details are in our{' '}
          <Link to="/terms" target="_blank" className="text-primary-600 font-medium hover:text-primary-700">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" target="_blank" className="text-primary-600 font-medium hover:text-primary-700">
            Privacy Policy
          </Link>
          .
        </p>
        <p className="text-xs text-foreground-500 leading-relaxed mb-6">
          You can withdraw any submission that hasn't been approved yet, and request deletion of your personal
          account information at any time.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onAgree}
            className="flex-1 py-2.5 rounded-full text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            I agree, let's go
          </button>
          <Link
            to="/studio"
            className="flex-1 text-center py-2.5 rounded-full text-sm font-medium bg-background-200 text-foreground-700 hover:bg-background-300 transition-colors duration-200 cursor-pointer"
          >
            Not now
          </Link>
        </div>
      </div>
    </div>
  );
}
