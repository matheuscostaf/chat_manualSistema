import HCaptcha from "@hcaptcha/react-hcaptcha";

export interface HCaptchaWrapperProps {
  siteKey: string;
  hCaptchaRef?: React.ForwardedRef<HCaptcha>;
  onVerify: (token: string) => void;
}

export default function HCaptchaWrapper({ siteKey, onVerify, hCaptchaRef }: HCaptchaWrapperProps) {
  return (
    <HCaptcha
      sitekey={siteKey}
      onVerify={onVerify}
      ref={hCaptchaRef}
    />
  );
}
