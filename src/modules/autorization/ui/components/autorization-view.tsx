import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useFormErrors } from '@/hooks/ui/useFormErrors'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLogin } from '@/modules/autorization/presenters/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { Form, FormField } from '@/UIKit/shadcn/ui/form-field'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Button } from '@/UIKit/shadcn/ui/button'
import { loginSchema } from '../../presenters/auth-schema'
import { PasswordInput } from '@/UIKit/shadcn/ui/input-password'

type AuthorizationViewData = z.infer<typeof loginSchema>

export const AuthorizationView = () => {
  const { t } = useTranslation('autorization')
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthorizationViewData>({ resolver: zodResolver(loginSchema) })

  useFormErrors(errors)

  const onSubmit = async (data: AuthorizationViewData) => {
    await loginMutation.mutateAsync(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-head">WineMates</CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormField name="email" label={t('email')} error={errors.email?.message}>
              <Input type="email" placeholder={t('email_plaseholder')} {...register('email')} />
            </FormField>

            <FormField name="password" label={t('password')} error={errors.password?.message}>
              <PasswordInput placeholder={t('password_plaseholder')} {...register('password')} />
            </FormField>

            <Button type="submit" disabled={isSubmitting} fullWidth className="mt-2" size="lg">
              {isSubmitting ? t('loading') : t('login')}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
