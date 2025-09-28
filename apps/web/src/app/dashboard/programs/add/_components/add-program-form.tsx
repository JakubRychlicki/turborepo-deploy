'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  getAddProgramFormSchema,
  type AddProgramFormValues
} from '@/lib/zod/program'
import { useTranslations } from 'next-intl'
import { CustomInputText } from '@/components/controls/custom-input-text'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from '@/components/ui/card'
import { CustomTextArea } from '@/components/controls/custom-text-area'
import { CategorySelect } from '@/components/controls/category-select'
import type { CategoryOption } from '@/types/category'
import { useState } from 'react'
import { LevelSelect } from '@/components/controls/level-select'
import { AddCategoryModal } from '@/components/controls/add-category-modal'
import { AudioSessionSelector } from '@/components/controls/audio-session-selector'
import type { AudioSession } from '@/types/audio_session'
import type { UploadResponse } from '@/types/upload'
import { ProgramThumbnailUpload } from './program-thumbnail-upload'

export function AddProgramForm() {
  const t = useTranslations('common')
  const tProgram = useTranslations('entities.program')
  const tValidation = useTranslations('validation')

  const [category, setCategory] = useState<CategoryOption | null>(null)
  const [selectedAudioSessions, setSelectedAudioSessions] = useState<
    AudioSession[]
  >([])
  const [thumbnail, setThumbnail] = useState<File | null>(null)

  const uploadThumbnail = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload`,
      {
        method: 'POST',
        body: formData,
        credentials: 'include'
      }
    )

    if (!response.ok) {
      throw new Error(tProgram('toast.errorUpload'))
    }

    const { id, url } = await response.json() as UploadResponse
    return { id, url }
  }

  const {
    setValue,
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<AddProgramFormValues>({
    resolver: zodResolver(getAddProgramFormSchema(tValidation)),
    defaultValues: {
      title: '',
      description: '',
      level: 1,
      targetAudience: '',
      expectedEffects: '',
      categoryId: null,
      thumbnailId: null,
      audioSessionIds: []
    },
    mode: 'onSubmit'
  })

  const handleLevelSelect = (selected: number) => {
    setValue('level', selected)
  }

  const handleCategorySelect = (selected: CategoryOption | null) => {
    setCategory(selected)
    setValue('categoryId', selected?.id || null)
  }

  const handleAudioSessionSelectionChange = (audioSessions: AudioSession[]) => {
    setSelectedAudioSessions(audioSessions)
    setValue(
      'audioSessionIds',
      audioSessions.map((session) => session.id)
    )
  }

  const onSubmit = async (values: AddProgramFormValues) => {
    console.log('formData', values)
  }

  return (
    <form
      id="create-program-form"
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Card className="px-6 gap-3">
        <CardTitle className="text-foreground">
          {tProgram('basicInformation')}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {tProgram('basicInformationDescription')}
        </CardDescription>
        <CardContent className="px-0 space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <CustomInputText
              id="title"
              label={tProgram('title')}
              placeholder={tProgram('titlePlaceholder')}
              errors={errors.title?.message}
              {...register('title')}
            />

            <LevelSelect
              selectedLevel={watch('level')}
              onSelect={handleLevelSelect}
            />
          </div>

          <div className="flex gap-4 items-end">
            <CategorySelect
              selectedName={category?.name || null}
              selectedValue={category?.id || null}
              onSelect={handleCategorySelect}
            />
            <AddCategoryModal />
          </div>

          <CustomTextArea
            id="description"
            label={tProgram('description')}
            placeholder={tProgram('descriptionPlaceholder')}
            errors={errors.description?.message}
            isOptional={true}
            maxLength={1000}
            showCharCount={true}
            value={watch('description') || ''}
            {...register('description')}
          />

          <CustomTextArea
            id="targetAudience"
            label={tProgram('targetAudience')}
            placeholder={tProgram('targetAudiencePlaceholder')}
            errors={errors.targetAudience?.message}
            isOptional={true}
            maxLength={200}
            showCharCount={true}
            value={watch('targetAudience') || ''}
            {...register('targetAudience')}
          />

          <CustomTextArea
            id="expectedEffects"
            label={tProgram('expectedEffects')}
            placeholder={tProgram('expectedEffectsPlaceholder')}
            errors={errors.expectedEffects?.message}
            isOptional={true}
            maxLength={500}
            showCharCount={true}
            value={watch('expectedEffects') || ''}
            {...register('expectedEffects')}
          />

          <ProgramThumbnailUpload
            id="program-thumbnail-upload"
            onImageChange={setThumbnail}
          />
        </CardContent>
      </Card>

      <Card className="px-6 gap-3">
        <CardTitle className="text-foreground">
          {tProgram('audioSessions')}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {tProgram('audioSessionsDescription')}
        </CardDescription>
        <CardContent className="px-0 space-y-4">
          <AudioSessionSelector
            selectedAudioSessions={selectedAudioSessions}
            onSelectionChange={handleAudioSessionSelectionChange}
          />
        </CardContent>
      </Card>

      <Card className="px-6 gap-3">
        <CardTitle className="text-foreground">
          {tProgram('keywords')}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {tProgram('keywordsDescription')}
        </CardDescription>
        <CardContent className="px-0 space-y-4"></CardContent>
      </Card>

      <Button
        form="create-program-form"
        type="submit"
        className="max-md:w-full min-w-40"
      >
        {t('actions.save')}
      </Button>
    </form>
  )
}
