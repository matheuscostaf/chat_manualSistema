import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import { HCaptchaWrapperProps } from './HCaptchaWrapper';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const DynamicHCaptcha = dynamic(() => import('./HCaptchaWrapper'), { ssr: false });

const HCaptchaComponent = forwardRef<HCaptcha, HCaptchaWrapperProps>((props, ref) => {
  return (
    <DynamicHCaptcha {...props} hCaptchaRef={ref} />
  );
});

export default HCaptchaComponent;
