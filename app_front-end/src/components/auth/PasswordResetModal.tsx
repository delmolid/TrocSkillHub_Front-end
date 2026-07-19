import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputOtp } from "primereact/inputotp";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { AuthMessage } from "./AuthMessage";
import { useToast, TOAST_SEVERITY } from "../../context/ToastContext";
import {
  useRequestPasswordReset,
  useResetPassword,
  useVerifyPasswordResetCode,
} from "../../hooks/usePasswordResetMutations";
import type {
  PasswordResetCodeFields,
  PasswordResetEmailFields,
  PasswordResetNewPasswordFields,
  PasswordResetStep,
} from "../../types/auth.types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_PATTERN = /^\d{4}$/;
const RESEND_COOLDOWN_SECONDS = 30;

const STEP_HEADERS: Record<PasswordResetStep, string> = {
  email: "Mot de passe oublié",
  code: "Vérification du code",
  newPassword: "Nouveau mot de passe",
  success: "Mot de passe modifié",
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

interface PasswordResetModalProps {
  visible: boolean;
  onHide: () => void;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  visible,
  onHide,
}) => {
  const [step, setStep] = useState<PasswordResetStep>("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const { showToast } = useToast();

  const requestResetMutation = useRequestPasswordReset();
  const verifyCodeMutation = useVerifyPasswordResetCode();
  const resetPasswordMutation = useResetPassword();

  const emailForm = useForm<PasswordResetEmailFields>();
  const codeForm = useForm<PasswordResetCodeFields>();
  const newPasswordForm = useForm<PasswordResetNewPasswordFields>();
  const newPasswordValue = newPasswordForm.watch("newPassword");

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const resetInternalState = () => {
    setStep("email");
    setEmail("");
    setResetToken("");
    setResendCooldown(0);
    emailForm.reset();
    codeForm.reset();
    newPasswordForm.reset();
    requestResetMutation.reset();
    verifyCodeMutation.reset();
    resetPasswordMutation.reset();
  };

  const handleHide = () => {
    resetInternalState();
    onHide();
  };

  const onSubmitEmail = async (data: PasswordResetEmailFields) => {
    try {
      await requestResetMutation.mutateAsync({ email: data.email });
      setEmail(data.email);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setStep("code");
    } catch {
     return 
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !email) return;
    try {
      await requestResetMutation.mutateAsync({ email });
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      showToast({
        severity: "info",
        summary: "Code renvoyé",
        detail: "Un nouveau code a été envoyé si votre demande est valide.",
        life: 4000,
        className: TOAST_SEVERITY.info,
        contentClassName: "flex items-center gap-3 px-3.5 py-3",
      });
    } catch {
      return 
    }
  };

  const onSubmitCode = async (data: PasswordResetCodeFields) => {
    try {
      const token = await verifyCodeMutation.mutateAsync({ email, code: data.code });
      setResetToken(token);
      codeForm.reset();
      setStep("newPassword");
    } catch {
      return
    }
  };

  const onSubmitNewPassword = async (data: PasswordResetNewPasswordFields) => {
    try {
      await resetPasswordMutation.mutateAsync({
        resetToken,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      newPasswordForm.reset();
      setStep("success");
      showToast({
        severity: "success",
        summary: "Mot de passe modifié",
        detail: "Votre mot de passe a été mis à jour avec succès.",
        life: 4000,
        className: TOAST_SEVERITY.success,
        contentClassName: "flex items-center gap-3 px-3.5 py-3",
      });
    } catch {
      return
    }
  };

  return (
    <Dialog
      header={STEP_HEADERS[step]}
      visible={visible}
      onHide={handleHide}
      dismissableMask
      style={{ width: "28rem" }}
      breakpoints={{ "960px": "90vw" }}
      pt={{
        root: { className: "rounded-xl shadow-xl border border-secondary/20 bg-white font-sans" },
        header: { className: "flex items-center px-6 pt-10 pb-3 border-b border-secondary/15" },
        headerTitle: { className: "text-base font-bold text-text" },
        content: { className: "px-6 py-5" },
        closeButton: { className: "ml-auto text-text/40 hover:text-text transition-opacity" },
      }}
    >
      {step === "email" && (
        <form
          onSubmit={emailForm.handleSubmit(onSubmitEmail)}
          noValidate
          className="auth-form-panel flex w-full flex-col gap-6"
          style={{ padding: "clamp(15px, 2.5vw, 32px)" }}
        >
          <p className="m-0 text-sm text-text">
            Saisissez votre adresse email : si un compte existe, un code de vérification à 4
            chiffres vous sera envoyé.
          </p>

          <div className="flex flex-col gap-1">
            <Controller
              name="email"
              control={emailForm.control}
              rules={{
                required: "L'adresse email est requise",
                pattern: { value: EMAIL_PATTERN, message: "Email invalide" },
              }}
              render={({ field }) => (
                <InputText {...field} placeholder="Votre email" type="email" />
              )}
            />
            {emailForm.formState.errors.email && (
              <AuthMessage variant="error">
                {emailForm.formState.errors.email.message}
              </AuthMessage>
            )}
          </div>

          <Button
            type="submit"
            label={requestResetMutation.isPending ? "Envoi..." : "Envoyer le code"}
            className="ts-btn-auth"
            disabled={requestResetMutation.isPending}
          />
        </form>
      )}

      {step === "code" && (
        <form
          onSubmit={codeForm.handleSubmit(onSubmitCode)}
          noValidate
          className="auth-form-panel flex w-full flex-col gap-4"
          style={{ padding: "clamp(15px, 2.5vw, 32px)" }}
        >
          <p className="m-0 text-sm text-text">
            {"Saisissez le code à 4 chiffres reçu par email à l'adresse "}
            <strong>{email}</strong>.
          </p>

          <div className="flex flex-col items-center gap-1">
            <Controller
              name="code"
              control={codeForm.control}
              rules={{
                required: "Le code est requis",
                pattern: { value: CODE_PATTERN, message: "Le code doit contenir exactement 4 chiffres" },
              }}
              render={({ field }) => (
                <InputOtp
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(String(e.value ?? ""))}
                  onBlur={field.onBlur}
                  length={4}
                  integerOnly
                  invalid={!!codeForm.formState.errors.code}
                />
              )}
            />
            {codeForm.formState.errors.code && (
              <AuthMessage variant="error">
                {codeForm.formState.errors.code.message}
              </AuthMessage>
            )}
          </div>

          {verifyCodeMutation.isError && (
            <AuthMessage variant="error">
              {getErrorMessage(verifyCodeMutation.error, "Code invalide ou expiré. Veuillez réessayer.")}
            </AuthMessage>
          )}

          <Button
            type="submit"
            label={verifyCodeMutation.isPending ? "Vérification..." : "Vérifier le code"}
            className="ts-btn-auth"
            disabled={verifyCodeMutation.isPending}
          />

          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendCooldown > 0 || requestResetMutation.isPending}
            className="self-center bg-transparent p-0 text-sm font-medium text-primary-border underline decoration-dotted disabled:cursor-not-allowed disabled:text-text/40 disabled:no-underline"
          >
            {resendCooldown > 0 ? `Renvoyer le code (${resendCooldown}s)` : "Renvoyer le code"}
          </button>
        </form>
      )}

      {step === "newPassword" && (
        <form
          onSubmit={newPasswordForm.handleSubmit(onSubmitNewPassword)}
          noValidate
          className="auth-form-panel flex w-full flex-col gap-4"
          style={{ padding: "clamp(15px, 2.5vw, 32px)" }}
        >
          <p className="m-0 text-sm text-text">
            Choisissez votre nouveau mot de passe (8 caractères minimum).
          </p>

          <div className="flex flex-col gap-1">
            <Controller
              name="newPassword"
              control={newPasswordForm.control}
              rules={{
                required: "Le mot de passe est requis",
                minLength: { value: 8, message: "Le mot de passe doit contenir au moins 8 caractères" },
              }}
              render={({ field }) => (
                <Password
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  placeholder="Nouveau mot de passe"
                  toggleMask
                  feedback={false}
                  className="w-full"
                />
              )}
            />
            {newPasswordForm.formState.errors.newPassword && (
              <AuthMessage variant="error">
                {newPasswordForm.formState.errors.newPassword.message}
              </AuthMessage>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Controller
              name="confirmPassword"
              control={newPasswordForm.control}
              rules={{
                required: "Veuillez confirmer votre mot de passe",
                validate: (value) => value === newPasswordValue || "Les mots de passe ne correspondent pas",
              }}
              render={({ field }) => (
                <Password
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  placeholder="Confirmer le mot de passe"
                  toggleMask
                  feedback={false}
                  className="w-full"
                />
              )}
            />
            {newPasswordForm.formState.errors.confirmPassword && (
              <AuthMessage variant="error">
                {newPasswordForm.formState.errors.confirmPassword.message}
              </AuthMessage>
            )}
          </div>

          {resetPasswordMutation.isError && (
            <AuthMessage variant="error">
              {getErrorMessage(resetPasswordMutation.error, "Unable to reset password.")}
            </AuthMessage>
          )}

          <Button
            type="submit"
            label={resetPasswordMutation.isPending ? "Mise à jour..." : "Réinitialiser le mot de passe"}
            className="ts-btn-auth"
            disabled={resetPasswordMutation.isPending}
          />
        </form>
      )}

      {step === "success" && (
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <p className="m-0 text-sm text-text">
            Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.
          </p>
          <Button label="Retour à la connexion" className="ts-btn-auth" onClick={handleHide} />
        </div>
      )}
    </Dialog>
  );
};
