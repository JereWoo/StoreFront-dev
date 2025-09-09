import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { upperFirst, useToggle } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { query } from "@/lib/vendure/client";
import { REGISTER_CUSTOMER_ACCOUNT, LOGIN } from "@/lib/vendure/mutations";
import { useAuth } from "@/lib/vendure/AuthState";

// ---------- Types that match Vendure responses ----------

type CurrentUser = {
  __typename: "CurrentUser";
  id: string;
  identifier: string;
};

type LoginErrorName =
  | "InvalidCredentialsError"
  | "NotVerifiedError"
  | "NativeAuthStrategyError"
  | "ErrorResult";

type LoginError = {
  __typename: LoginErrorName;
  message: string;
  errorCode?: string;
};

type LoginResult = CurrentUser | LoginError;

type RegisterResult =
  | { __typename: "Success"; success: boolean }
  | { __typename: string; message: string; errorCode?: string };

// ---------- Component ----------

export function AuthenticationForm(props: PaperProps) {
  const [mode, toggleMode] = useToggle<"login" | "register">([
    "login",
    "register",
  ]);
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const redirectTo =
    (typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("redirect")) ||
    "/";

  const form = useForm({
    initialValues: { email: "", name: "", password: "", terms: true },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email address"),
      password: (val) =>
        val.length < 6 ? "Password must be at least 6 characters" : null,
      ...(mode === "register"
        ? {
            terms: (v: boolean) => (v ? null : "You must accept the terms"),
          }
        : {}),
    },
  });

  // REGISTER
  const registerMutation = useMutation({
    mutationFn: async (values: {
      email: string;
      name: string;
      password: string;
    }) => {
      const res = await query(REGISTER_CUSTOMER_ACCOUNT, {
        input: {
          emailAddress: values.email,
          firstName: values.name?.split(" ")[0] ?? "",
          lastName: values.name?.split(" ").slice(1).join(" ") ?? "",
          password: values.password,
        },
      });
      return res.data.registerCustomerAccount as RegisterResult;
    },
  });

  // LOGIN
  const loginMutation = useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      const res = await query(LOGIN, {
        username: values.email,
        password: values.password,
        rememberMe: true,
      });
      return res.data.login as LoginResult;
    },
    onSuccess: async (result) => {
      if (result.__typename === "CurrentUser") {
        // token was already captured by your query() via response header
        await refresh(); // confirm token + hydrate user/customer
        navigate({ to: redirectTo }); // then go where the user intended
      }
    },
  });

  const onSubmit = form.onSubmit(async (values) => {
    if (mode === "register") {
      const res = await registerMutation.mutateAsync(values);
      if (res.__typename === "Success" && "success" in res && res.success) {
        // Inform and switch to login mode
        // (You can swap with Mantine notifications if you use them)
        form.reset();
        toggleMode();
      } else {
        // surface error
        form.setErrors({
          email:
            "message" in res && typeof res.message === "string"
              ? res.message
              : "Registration failed",
        });
      }
    } else {
      const res = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
      if (res.__typename !== "CurrentUser") {
        form.setFieldError("password", res.message ?? "Invalid credentials");
      }
    }
  });

  return (
    <Paper radius="md" p="lg" withBorder {...props}>
      <Text ta="center" size="lg" fw={600}>
        {upperFirst(mode)}
      </Text>

      <Divider label="Use your email" labelPosition="center" my="lg" />

      <form onSubmit={onSubmit}>
        <Stack>
          {mode === "register" && (
            <TextInput
              label="Name"
              placeholder="Jane Doe"
              value={form.values.name}
              onChange={(e) =>
                form.setFieldValue("name", e.currentTarget.value)
              }
              radius="md"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="you@example.com"
            value={form.values.email}
            onChange={(e) => form.setFieldValue("email", e.currentTarget.value)}
            error={form.errors.email}
            radius="md"
            autoComplete="email"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="••••••••"
            value={form.values.password}
            onChange={(e) =>
              form.setFieldValue("password", e.currentTarget.value)
            }
            error={form.errors.password}
            radius="md"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
          />

          {mode === "register" && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(e) =>
                form.setFieldValue("terms", e.currentTarget.checked)
              }
              error={form.errors.terms as string | undefined}
            />
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor
            component="button"
            type="button"
            c="dimmed"
            onClick={() => {
              // reset errors when switching modes
              form.clearErrors();
              toggleMode();
            }}
            size="xs"
          >
            {mode === "register"
              ? "Already have an account? Log in"
              : "Don't have an account? Register"}
          </Anchor>

          <Button
            type="submit"
            radius="xl"
            loading={registerMutation.isPending || loginMutation.isPending}
            disabled={
              registerMutation.isPending ||
              loginMutation.isPending ||
              !!Object.values(form.errors).find(Boolean)
            }
          >
            {upperFirst(mode)}
          </Button>
        </Group>

        {/* Inline status messages */}
        {registerMutation.isError && (
          <Text c="red" size="sm" mt="sm">
            {(registerMutation.error as Error)?.message ?? "Registration error"}
          </Text>
        )}
        {loginMutation.isError && (
          <Text c="red" size="sm" mt="sm">
            {(loginMutation.error as Error)?.message ?? "Login error"}
          </Text>
        )}
      </form>
    </Paper>
  );
}
