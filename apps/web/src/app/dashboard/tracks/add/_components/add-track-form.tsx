'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getTrackFormSchema, type AddTrackFormValues } from '@/lib/zod/track'
import { useTranslations } from 'next-intl'
import { CustomInputText } from '@/components/controls/custom-input-text'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CustomTextArea } from '@/components/controls/custom-text-area'
import { CustomInputNumber } from '@/components/controls/custom-input-number'
import { useState } from 'react'
import { TrackAudioUpload } from './track-audio-upload'
import { trpc } from '@/utils/trpc'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useRouter } from 'next/navigation'
import { NAVIGATION } from '@/config/constants'
import type { UploadResponse } from '@/types/upload'

export function AddTrackForm() {
  const t = useTranslations('common')
  const tTrack = useTranslations('entities.track')
  const tValidation = useTranslations('validation')
  const router = useRouter()
  const [audio, setAudio] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const uploadAudio = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
    
    if (!response.ok) {
      throw new Error(tTrack('toast.errorUpload'))
    }
    
    const { id, url } = await response.json() as UploadResponse
    return { id, url }
  }

  const createAudioSessionMutation = useMutation(
    trpc.audioSession.create.mutationOptions({
      onSuccess: () => {
        toast.success(tTrack('toast.success'))
        router.push(NAVIGATION.TRACKS)
      },
      onError: (error) => {
        console.error(tTrack('toast.error'), error)
        toast.error(tTrack('toast.error'))
      }
    })
  )

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<AddTrackFormValues>({
    resolver: zodResolver(getTrackFormSchema(tValidation)),
    defaultValues: {
      title: '',
      description: '',
      durationSeconds: '',
      mediaId: null
    },
    mode: 'onSubmit'
  })

  const onSubmit = async (values: AddTrackFormValues) => {
    if (!audio) {
      toast.error(tTrack('toast.audioRequired'))
      return
    }

    setIsUploading(true)

    try {
      const audioUploadResult = await uploadAudio(audio)
      
      const audioSessionData = {
        title: values.title,
        description: values.description || undefined,
        durationSeconds: values.durationSeconds ? parseInt(values.durationSeconds) : undefined,
        mediaId: audioUploadResult.id
      }
      
      await createAudioSessionMutation.mutateAsync(audioSessionData)
      
    } catch (error) {
      console.error(tTrack('toast.error'), error)
      toast.error(tTrack('toast.error'))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form
      id="create-track-form"
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Card className="px-6 gap-3">
        <CardContent className="px-0 space-y-4">
          <CustomInputText
            id="title"
            label={tTrack('title')}
            placeholder={tTrack('titlePlaceholder')}
            errors={errors.title?.message}
            {...register('title')}
          />

          <CustomTextArea
            id="description"
            label={tTrack('description')}
            placeholder={tTrack('descriptionPlaceholder')}
            errors={errors.description?.message}
            isOptional={true}
            maxLength={500}
            showCharCount={true}
            value={watch('description') || ''}
            {...register('description')}
          />

          <Controller
            name="durationSeconds"
            control={control}
            render={({ field }) => (
              <CustomInputNumber
                id="durationSeconds"
                label={tTrack('durationSeconds')}
                errors={errors.durationSeconds?.message}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />

          <TrackAudioUpload id="track-audio-upload" onAudioChange={setAudio} />
        </CardContent>
      </Card>

      <Button
        form="create-track-form"
        type="submit"
        className="max-md:w-full min-w-40"
        disabled={isUploading || createAudioSessionMutation.isPending}
      >
        {isUploading || createAudioSessionMutation.isPending ? (
          <LoadingSpinner />
        ) : (
          t('actions.save')
        )}
      </Button>
    </form>
  )
}
