'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  getAddCategoryFormSchema,
  type AddCategoryFormValues
} from '@/lib/zod/category'
import { trpc } from '@/utils/trpc'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useMutation } from '@tanstack/react-query'

export function AddCategoryModal() {
  const t = useTranslations('common')
  const tCategory = useTranslations('entities.category.add')
  const tValidation = useTranslations('validation')
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AddCategoryFormValues>({
    resolver: zodResolver(getAddCategoryFormSchema(tValidation)),
    defaultValues: {
      name: ''
    },
    mode: 'onSubmit'
  })

  const createMutation = useMutation(
    trpc.programCategory.create.mutationOptions({
      onSuccess: () => {
        reset()
        setOpen(false)
      },
      onError: (error) => {
        console.error('Błąd podczas tworzenia kategorii:', error)
      }
    })
  )

  const onSubmit = (values: AddCategoryFormValues) => {
    createMutation.mutate({
      name: values.name
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      reset()
    }
  }

  const handleClose = () => {
    setOpen(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="size-4" />
          {tCategory('button')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md gap-6">
        <DialogHeader>
          <DialogTitle>{tCategory('title')}</DialogTitle>
          <DialogDescription className="sr-only">
            {tCategory('description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{tCategory('name')}</Label>
            <Input
              id="name"
              placeholder={tCategory('namePlaceholder')}
              {...register('name')}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outlineSecondary"
              onClick={handleClose}
              disabled={createMutation.isPending}
              className="w-24 "
            >
              {t('actions.cancel')}
            </Button>
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={createMutation.isPending}
              className="w-24"
            >
              {createMutation.isPending ? (
                <LoadingSpinner />
              ) : (
                tCategory('button')
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
