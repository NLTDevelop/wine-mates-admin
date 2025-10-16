import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/ui/useToast'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLogin } from '@/hooks/api/useAuth'
import { loginSchema } from '@/lib/validators'
import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { Form, FormField } from '@/UIKit/shadcn/ui/form-field'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Button } from '@/UIKit/shadcn/ui/button'
import { useFormErrors } from '@/hooks/ui/useFormErrors'

type AutorizationFormData = z.infer<typeof loginSchema>

export const AutorizationForm = () => {
  const { t } = useTranslation('autorization')
  const loginMutation = useLogin()
  const { notifyToast } = useToast()

  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AutorizationFormData>({ resolver: zodResolver(loginSchema) })

  useFormErrors(errors)

  const onSubmit = async (data: AutorizationFormData) => {
    console.log(data)
    await loginMutation.mutateAsync(data)
    notifyToast(t('success_entry'), 'success')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
              <Input
                type="password"
                placeholder={t('password_plaseholder')}
                {...register('password')}
              />
            </FormField>

            <Button type="submit" disabled={isSubmitting} fullWidth className='mt-2' size="lg">
              {isSubmitting ? t('loading') : t('log_in')}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
