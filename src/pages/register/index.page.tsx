import { api } from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  FormError,
  RegisterContainer,
  RegisterForm,
  RegisterHeader,
} from './styles'
import { NextSeo } from 'next-seo'

// import { Container } from './styles';

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário precisa ter apenas letras e hífens.',
    })
    .transform((username) => username.toLocaleLowerCase()),
  name: z
    .string()
    .min(3, { message: 'O nome precisar ter pelo menos 3 letras' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const router = useRouter()

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      })
      await router.push('/register/connect-calendar')
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data?.message) {
        alert(error?.response?.data?.message)
      }
    }
  }

  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue])

  return (
    <>
      <NextSeo title="Crie uma conta | Ignite Call" />
      <RegisterContainer>
        <RegisterHeader>
          <Heading as={'strong'}>Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>
          <MultiStep size={4} currentStep={1} />
        </RegisterHeader>
        <RegisterForm as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size="sm">Nome de usuário</Text>
            <TextInput
              prefix="ignite.com/"
              placeholder="seu-usuário"
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              {...register('username')}
            />
            {errors.username && (
              <FormError size={'sm'}>{errors.username.message}</FormError>
            )}
          </label>
          <label>
            <Text size="sm">Nome completo</Text>
            <TextInput
              placeholder="Seu nome"
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              {...register('name')}
            />
            {errors.name && (
              <FormError size={'sm'}>{errors.name.message}</FormError>
            )}
          </label>
          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </RegisterForm>
      </RegisterContainer>
    </>
  )
}

export default Register
