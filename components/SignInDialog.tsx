import { useEffect, useRef, useState } from 'react';

import {
  AbsoluteCenter,
  Button,
  Field,
  Flex,
  IconButton,
  Input,
  Portal,
  ProgressCircle,
  Span,
  Stack,
  Text
} from '@chakra-ui/react';

import { LuX } from 'react-icons/lu';

import { Dialog } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/toaster';

import { useUser } from '@/context/UserProvider';

const MAX_LENGTH_EMAIL = 255;
const RESEND_OTP_COUNTDOWN = 60;

interface SignInDialogProps {
  signInDialogOpen: boolean;
  setSignInDialogOpen: (signInDialogOpen: boolean) => void;
}

const SignInDialog = ({ signInDialogOpen, setSignInDialogOpen }: SignInDialogProps) => {
  const { signIn } = useUser();

  const [signInVerificationDialogOpen, setSignInVerificationDialogOpen] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');

  const [otpSending, setOtpSending] = useState<boolean>(false);
  const [otpResending, setOtpResending] = useState<boolean>(false);
  const [otpVerifying, setOtpVerifying] = useState<boolean>(false);

  const [canResendOtp, setCanResendOtp] = useState<boolean>(false);
  const [resendOtpCountdown, setResendOtpCountdown] = useState(RESEND_OTP_COUNTDOWN);

  const signInInitialFocusRef = useRef<HTMLInputElement | null>(null);
  const signInVerificationInitialFocusRef = useRef<HTMLInputElement | null>(null);

  const lastSentEmailRef = useRef<string>('');
  const preserveEmailRef = useRef<boolean>(false);

  useEffect(() => {
    if (signInDialogOpen) {
      if (preserveEmailRef.current) {
        preserveEmailRef.current = false;
      } else {
        setEmail('');
        lastSentEmailRef.current = '';
      }
    }
  }, [signInDialogOpen]);

  useEffect(() => {
    if (signInVerificationDialogOpen) {
      setVerificationCode('');
    }
  }, [signInVerificationDialogOpen]);

  useEffect(() => {
    if (!canResendOtp && resendOtpCountdown > 0) {
      const timer = setTimeout(() => {
        setResendOtpCountdown(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (resendOtpCountdown === 0) {
      setCanResendOtp(true);
    }
  }, [canResendOtp, resendOtpCountdown]);

  const handleSendCode = async (e: any) => {
    e.preventDefault();

    if (email === lastSentEmailRef.current) {
      setSignInDialogOpen(false);
      setSignInVerificationDialogOpen(true);

      return;
    }

    setOtpSending(true);

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        Toaster.create({
          type: 'error',
          title: 'Failed to send verification code',
          description: data.error ?? 'Please try again.'
        });

        return;
      }

      lastSentEmailRef.current = email;

      setCanResendOtp(false);
      setResendOtpCountdown(RESEND_OTP_COUNTDOWN);

      setSignInDialogOpen(false);
      setSignInVerificationDialogOpen(true);
    } catch (error) {
      console.error(error);

      Toaster.create({
        type: 'error',
        title: 'Something went wrong',
        description: 'Please try again.'
      });
    } finally {
      setOtpSending(false);
    }
  };

  const handleEditEmail = () => {
    preserveEmailRef.current = true;

    setSignInDialogOpen(true);
    setSignInVerificationDialogOpen(false);
  };

  const handleResendCode = async () => {
    if (!canResendOtp) {
      return;
    }

    setOtpResending(true);

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        Toaster.create({
          type: 'error',
          title: 'Failed to resend verification code',
          description: data.error ?? 'Please try again.'
        });

        return;
      }

      Toaster.create({
        type: 'success',
        title: 'Verification code resent',
        description: 'Check your inbox for a new verification code.'
      });

      setCanResendOtp(false);
      setResendOtpCountdown(RESEND_OTP_COUNTDOWN);
    } catch (error) {
      console.error(error);

      Toaster.create({
        type: 'error',
        title: 'Something went wrong',
        description: 'Please try again.'
      });
    } finally {
      setOtpResending(false);
    }
  };

  const handleSignIn = async (e: any) => {
    e.preventDefault();

    if (verificationCode.length !== 6) {
      Toaster.create({
        type: 'error',
        title: 'Invalid verification code',
        description: 'The verification code must be 6 digits long.'
      });

      return;
    }

    setOtpVerifying(true);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: verificationCode })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        Toaster.create({
          type: 'error',
          title: 'Invalid verification code',
          description: data.error ?? 'Please try again.'
        });

        return;
      }

      signIn(data.token);

      Toaster.create({
        type: 'success',
        title: 'Signed in',
        description: 'You are now signed in to your account.'
      });

      setSignInVerificationDialogOpen(false);
    } catch (error) {
      console.error(error);

      Toaster.create({
        type: 'error',
        title: 'Something went wrong',
        description: 'Please try again.'
      });
    } finally {
      setOtpVerifying(false);
    }
  };

  return (
    <>
      <Dialog.Root
        size="sm"
        open={signInDialogOpen}
        onOpenChange={e => setSignInDialogOpen(e.open)}
        initialFocusEl={() => signInInitialFocusRef.current}
      >
        <Portal>
          <Dialog.Backdrop backdropFilter="blur(2px)" />

          <Dialog.Positioner>
            <Dialog.Content mx={4}>
              <Dialog.Header px={6} pt={6} pb={0} gap={4} alignItems="center" justifyContent="space-between">
                <Dialog.Title>Sign in</Dialog.Title>

                <Dialog.CloseTrigger asChild position="unset" colorPalette="gray">
                  <IconButton aria-label="Close" variant="outline" size="xs" color="inherit">
                    <LuX />
                  </IconButton>
                </Dialog.CloseTrigger>
              </Dialog.Header>

              <form onSubmit={handleSendCode}>
                <Dialog.Body p={6}>
                  <Stack gap={6}>
                    <Text fontSize="md">
                      Enter your email to sign in or create an account. We'll send a verification code to confirm it's
                      you.
                    </Text>

                    <Field.Root required>
                      <Field.Label>
                        Email <Field.RequiredIndicator />
                      </Field.Label>

                      <Input
                        ref={signInInitialFocusRef}
                        placeholder="john.doe@example.com"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.currentTarget.value.slice(0, MAX_LENGTH_EMAIL))}
                        maxLength={MAX_LENGTH_EMAIL}
                        pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                      />

                      <Field.HelperText fontVariantNumeric="tabular-nums">
                        {email.length} / {MAX_LENGTH_EMAIL}
                      </Field.HelperText>
                    </Field.Root>
                  </Stack>
                </Dialog.Body>

                <Dialog.Footer px={6} pt={0} pb={6} justifyContent="flex-start">
                  <Button type="submit" loading={otpSending}>
                    Send code
                  </Button>

                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </Dialog.ActionTrigger>
                </Dialog.Footer>
              </form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root
        size="sm"
        open={signInVerificationDialogOpen}
        onOpenChange={e => setSignInVerificationDialogOpen(e.open)}
        initialFocusEl={() => signInVerificationInitialFocusRef.current}
      >
        <Portal>
          <Dialog.Backdrop backdropFilter="blur(2px)" />

          <Dialog.Positioner>
            <Dialog.Content mx={4}>
              <Dialog.Header px={6} pt={6} pb={0} gap={4} alignItems="center" justifyContent="space-between">
                <Dialog.Title>Sign in</Dialog.Title>

                <Dialog.CloseTrigger asChild position="unset" colorPalette="gray">
                  <IconButton aria-label="Close" variant="outline" size="xs" color="inherit">
                    <LuX />
                  </IconButton>
                </Dialog.CloseTrigger>
              </Dialog.Header>

              <form onSubmit={handleSignIn}>
                <Dialog.Body p={6}>
                  <Stack gap={6}>
                    <Text fontSize="md">We've sent a verification code to your email. Enter it below to continue.</Text>

                    <Stack align="flex-start">
                      <Text fontSize="md">
                        Sent to{' '}
                        <Span fontWeight="medium" wordBreak="break-all">
                          {email}
                        </Span>
                      </Text>

                      <Button variant="surface" size="sm" onClick={handleEditEmail}>
                        Edit email
                      </Button>
                    </Stack>

                    <Field.Root required>
                      <Field.Label>
                        Verification code <Field.RequiredIndicator />
                      </Field.Label>

                      <Input
                        ref={signInVerificationInitialFocusRef}
                        placeholder="123456"
                        type="number"
                        inputMode="numeric"
                        value={verificationCode}
                        onChange={e => setVerificationCode(e.currentTarget.value)}
                      />
                    </Field.Root>

                    <Flex gap={4} align="center">
                      <Button
                        variant="surface"
                        size="sm"
                        onClick={handleResendCode}
                        loading={otpResending}
                        disabled={!canResendOtp}
                      >
                        Resend code
                      </Button>

                      {!canResendOtp && (
                        <ProgressCircle.Root
                          size="sm"
                          colorPalette="gray"
                          value={(resendOtpCountdown / RESEND_OTP_COUNTDOWN) * 100}
                        >
                          <ProgressCircle.Circle css={{ '--thickness': '2.5px' }}>
                            <ProgressCircle.Track />
                            <ProgressCircle.Range stroke="pink.focusRing" />
                          </ProgressCircle.Circle>

                          <AbsoluteCenter>
                            <ProgressCircle.ValueText fontSize="sm">{resendOtpCountdown}</ProgressCircle.ValueText>
                          </AbsoluteCenter>
                        </ProgressCircle.Root>
                      )}
                    </Flex>
                  </Stack>
                </Dialog.Body>

                <Dialog.Footer px={6} pt={0} pb={6} justifyContent="flex-start">
                  <Button type="submit" loading={otpVerifying}>
                    Sign in
                  </Button>

                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </Dialog.ActionTrigger>
                </Dialog.Footer>
              </form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default SignInDialog;
