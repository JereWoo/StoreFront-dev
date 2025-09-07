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
import { GoogleButton } from "./GoogleButton";
import { TwitterButton } from "./TwitterButton";
import { useMutation } from "@tanstack/react-query";
import { query } from "@/lib/vendure/client";
import { REGISTER_CUSTOMER_ACCOUNT, LOGIN } from "@/lib/vendure/mutations";

// ---------- Types ----------

type LoginSuccess = {
  id: string;
  identifier: string;
};

type LoginError = {
  errorCode: string;
  message: string;
};

type LoginResponse = LoginSuccess | LoginError;

function isLoginSuccess(resp: LoginResponse): resp is LoginSuccess {
  return "id" in resp;
}

type RegisterSuccess = {
  success: boolean;
};

type RegisterError = {
  errorCode: string;
  message: string;
};

type RegisterResponse = RegisterSuccess | RegisterError;

function isRegisterSuccess(resp: RegisterResponse): resp is RegisterSuccess {
  return "success" in resp;
}

// ---------- Component ----------

export function AuthenticationForm(props: PaperProps) {
  const registerMutation = useMutation<
    RegisterResponse,
    Error,
    {
      email: string;
      name: string;
      password: string;
    }
  >({
    mutationFn: async (values) => {
      const res = await query(REGISTER_CUSTOMER_ACCOUNT, {
        input: {
          emailAddress: values.email,
          firstName: values.name?.split(" ")[0] ?? "",
          lastName: values.name?.split(" ").slice(1).join(" ") ?? "",
          password: values.password,
        },
      });
      return res.data.registerCustomerAccount as RegisterResponse;
    },
  });

  const loginMutation = useMutation<
    LoginResponse,
    Error,
    { email: string; password: string }
  >({
    mutationFn: async (values) => {
      const res = await query(LOGIN, {
        username: values.email,
        password: values.password,
      });
      return res.data.login as LoginResponse;
    },
  });

  const [type, toggle] = useToggle(["login", "register"]);
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  return (
    <Paper radius="md" p="lg" withBorder {...props}>
      <Text ta="center" size="lg" fw={500}>
        {type}
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
        <TwitterButton radius="xl">Twitter</TwitterButton>
      </Group>

      <Divider label="Or" labelPosition="center" my="lg" />

      <form
        onSubmit={form.onSubmit(async (values) => {
          if (type === "register") {
            registerMutation.mutate(values, {
              onSuccess: (data) => {
                if (isRegisterSuccess(data)) {
                  alert(
                    "🎉 Account created! Please check your email to verify.",
                  );
                  toggle(); // switch back to login
                } else {
                  alert(data.message ?? "Error");
                }
              },
            });
          } else {
            loginMutation.mutate(values, {
              onSuccess: (data) => {
                if (isLoginSuccess(data)) {
                  alert(`Welcome back ${data.identifier}!`);
                } else {
                  alert(data.message ?? "Invalid credentials");
                }
              },
            });
          }
        })}
      >
        <Stack>
          {type === "register" && (
            <TextInput
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue("name", event.currentTarget.value)
              }
              radius="md"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email && "Invalid email"}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={
              form.errors.password &&
              "Password should include at least 6 characters"
            }
            radius="md"
          />

          {type === "register" && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) =>
                form.setFieldValue("terms", event.currentTarget.checked)
              }
            />
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor
            component="button"
            type="button"
            c="dimmed"
            onClick={() => toggle()}
            size="xs"
          >
            {type === "register"
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Anchor>
          <Button
            type="submit"
            radius="xl"
            loading={registerMutation.isPending || loginMutation.isPending}
          >
            {upperFirst(type)}
          </Button>
        </Group>

        {(registerMutation.isError || loginMutation.isError) && (
          <Text c="red" size="sm" mt="sm">
            {(registerMutation.error as Error)?.message ??
              (loginMutation.error as Error)?.message}
          </Text>
        )}

        {registerMutation.isSuccess &&
          isRegisterSuccess(registerMutation.data) && (
            <Text c="green" size="sm" mt="sm">
              🎉 Account created! Please check your email to verify.
            </Text>
          )}

        {loginMutation.isSuccess && isLoginSuccess(loginMutation.data) && (
          <Text c="green" size="sm" mt="sm">
            Welcome back {loginMutation.data.identifier}!
          </Text>
        )}
      </form>
    </Paper>
  );
}
