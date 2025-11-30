import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { postJSON } from '@/lib/api'

export const Route = createFileRoute('/interim-skipper-quiz/')({
  component: RouteComponent,
})

function RouteComponent() {
  const radioQuestions = [
    {
      id: 'q1_distance_from_shore',
      label: 'What is the distance you should keep from the shoreline?',
      options: ['100 meters', '1200 meters', '300 meters', '15 miles'],
    },
    {
      id: 'q2_kill_switch',
      label:
        'If you were to fall off the PWC, what safety feature is designed to automatically deactivate the watercraft?',
      options: ['Your life jacket', 'The ignition', 'The Kill switch', 'The off button'],
    },
    {
      id: 'q3_what_to_wear',
      label: 'What do you need to wear before you get on to the PWC?',
      options: ['Wetsuit', 'Helmet', 'Life jacket'],
    },
    {
      id: 'q4_kill_switch_connection',
      label: 'The PWC will only start when the kill switch is connected to the ___________?',
      options: ['The life jacket', 'The middle container', 'The tab on the left handle'],
    },
    {
      id: 'q5_harbour_passing_rule',
      label: 'When idling in and out of the harbour, which side do you pass an approaching boat?',
      options: [
        'Vessels approaching head-on pass port to port (left-to-left)',
        'Starboard to starboard (right-to-right)',
        'Always pass behind the other boat',
        'Stop and let the other boat decide',
      ],
    },
    {
      id: 'q7_max_distance',
      label: 'What is the maximum distance you can travel in all directions?',
      options: ['1700 meters', '15 miles', '300 meters', '1000 meters'],
    },
  ] as const

  const multiQuestions = [
    {
      id: 'q6_harbour_rules',
      label: 'What rule applies when traversing out of the harbour?',
      options: [
        'Do not wave jump',
        'Do not cause wakes of any kind',
        'Do not make any sharp turns',
        'You can go without a life jacket',
        'Do not go to the beach area',
        '300 Meter distance from the shore line',
      ],
    },
    {
      id: 'q8_connect_kill_switch_two_places',
      label: 'Which two places do you connect the kill switch in order to safely operate the vessel?',
      options: [
        'To the handle',
        'To the middle console',
        'To the right handle',
        'To the tab on the left handle and any loop on the life jacket',
      ],
    },
    {
      id: 'q9_deposit_loss_reasons',
      label: 'Which of the following will cause you to lose your R1000 refundable deposit?',
      options: [
        'Falling off the PWC',
        'Switching off the PWC',
        'Wave jumping',
        'Causing wakes in the harbour',
        'Going to the beach',
        'Damaging the PWC',
        'Not staying 300 meters from the shoreline',
      ],
    },
    {
      id: 'q10_emergency_items_onboard',
      label: 'What emergency items are on board the PWC?',
      options: ['Fire extinguisher', 'Flare', 'Paddle ore', 'Life raft', 'Tube', 'Rope'],
    },
  ] as const

  type RadioQuestionId = (typeof radioQuestions)[number]['id']
  type MultiQuestionId = (typeof multiQuestions)[number]['id']
  const requiredSkipperFields = ['email', 'name', 'surname', 'idNumber'] as const

  type FormValues = {
    email: string
    name: string
    surname: string
    idNumber: string
    passengerName: string
    passengerSurname: string
    passengerEmail: string
    passengerIdNumber: string
    hasWatchedTutorial: boolean
    hasAcceptedIndemnity: boolean
    q1_distance_from_shore: string
    q2_kill_switch: string
    q3_what_to_wear: string
    q4_kill_switch_connection: string
    q5_harbour_passing_rule: string
    q6_harbour_rules: string[]
    q7_max_distance: string
    q8_connect_kill_switch_two_places: string[]
    q9_deposit_loss_reasons: string[]
    q10_emergency_items_onboard: string[]
  }

  const defaultValues: FormValues = {
    email: '',
    name: '',
    surname: '',
    idNumber: '',
    passengerName: '',
    passengerSurname: '',
    passengerEmail: '',
    passengerIdNumber: '',
    hasWatchedTutorial: false,
    hasAcceptedIndemnity: false,
    q1_distance_from_shore: '',
    q2_kill_switch: '',
    q3_what_to_wear: '',
    q4_kill_switch_connection: '',
    q5_harbour_passing_rule: '',
    q6_harbour_rules: [],
    q7_max_distance: '',
    q8_connect_kill_switch_two_places: [],
    q9_deposit_loss_reasons: [],
    q10_emergency_items_onboard: [],
  }

  const [values, setValues] = React.useState<FormValues>(defaultValues)
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormValues, string>>>({})
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const submitDisabled =
    submitting ||
    !requiredSkipperFields.every((field) => values[field].trim()) ||
    !values.hasWatchedTutorial ||
    !values.hasAcceptedIndemnity

  type TextField = Exclude<
    keyof FormValues,
    | 'hasWatchedTutorial'
    | 'hasAcceptedIndemnity'
    | 'q6_harbour_rules'
    | 'q8_connect_kill_switch_two_places'
    | 'q9_deposit_loss_reasons'
    | 'q10_emergency_items_onboard'
  >

  function handleChange(field: TextField) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }))
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(false)
    const nextErrors: Partial<Record<keyof FormValues, string>> = {}

    ;(['email', 'name', 'surname', 'idNumber'] as const).forEach((field) => {
      if (!values[field].trim()) {
        nextErrors[field] = 'This field is required'
      }
    })

    const passengerDetailsProvided = (['passengerName', 'passengerSurname', 'passengerEmail'] as const).some((field) =>
      values[field].trim(),
    )
    if (passengerDetailsProvided && !values.passengerIdNumber.trim()) {
      nextErrors.passengerIdNumber = 'Passenger ID Number required if passenger details are provided'
    }
    if (!values.hasWatchedTutorial) {
      nextErrors.hasWatchedTutorial = 'Please confirm you have watched the tutorial video'
    }
    if (!values.hasAcceptedIndemnity) {
      nextErrors.hasAcceptedIndemnity = 'Please confirm you agree to the indemnity'
    }

    radioQuestions.forEach((q) => {
      if (!values[q.id as RadioQuestionId]) {
        nextErrors[q.id as RadioQuestionId] = 'Please select an answer'
      }
    })

    multiQuestions.forEach((q) => {
      if (!(values[q.id as MultiQuestionId]?.length > 0)) {
        nextErrors[q.id as MultiQuestionId] = 'Select at least one option'
      }
    })

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const payload = {
      email: values.email,
      name: values.name,
      surname: values.surname,
      idNumber: values.idNumber,
      passengerName: values.passengerName.trim() || null,
      passengerSurname: values.passengerSurname.trim() || null,
      passengerEmail: values.passengerEmail.trim() || null,
      passengerIdNumber: values.passengerIdNumber.trim() || null,
      hasWatchedTutorial: values.hasWatchedTutorial,
      hasAcceptedIndemnity: values.hasAcceptedIndemnity,
      quizAnswers: {
        q1_distance_from_shore: values.q1_distance_from_shore,
        q2_kill_switch: values.q2_kill_switch,
        q3_what_to_wear: values.q3_what_to_wear,
        q4_kill_switch_connection: values.q4_kill_switch_connection,
        q5_harbour_passing_rule: values.q5_harbour_passing_rule,
        q6_harbour_rules: values.q6_harbour_rules,
        q7_max_distance: values.q7_max_distance,
        q8_connect_kill_switch_two_places: values.q8_connect_kill_switch_two_places,
        q9_deposit_loss_reasons: values.q9_deposit_loss_reasons,
        q10_emergency_items_onboard: values.q10_emergency_items_onboard,
      },
    }

    try {
      setSubmitting(true)
      await postJSON<{ ok: boolean; success?: boolean; id: string }>('/api/interim-skipper-quiz', payload)
      setSubmitSuccess(true)
      setValues(defaultValues)
      setErrors({})
    } catch (err: any) {
      const msg = err?.message || 'Unable to submit right now. Please try again.'
      setSubmitError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  function handleRadioChange(questionId: RadioQuestionId, option: string) {
    setValues((prev) => ({ ...prev, [questionId]: option }))
    if (errors[questionId]) {
      setErrors((prev) => ({ ...prev, [questionId]: '' }))
    }
  }

  function toggleMultiOption(questionId: MultiQuestionId, option: string) {
    setValues((prev) => {
      const hasOption = prev[questionId].includes(option)
      const nextOptions = hasOption ? prev[questionId].filter((o) => o !== option) : [...prev[questionId], option]
      return { ...prev, [questionId]: nextOptions }
    })
    if (errors[questionId]) {
      setErrors((prev) => ({ ...prev, [questionId]: '' }))
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-slate-900">Interim Skippers Licence Quiz &amp; Indemnity</h1>
      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/5bZ37Hf82B0?start=13"
            title="Interim Skippers Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              required
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email ? (
              <p id="email-error" className="text-sm text-red-600">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={values.name}
              onChange={handleChange('name')}
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name ? (
              <p id="name-error" className="text-sm text-red-600">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="surname">Surname</Label>
            <Input
              id="surname"
              value={values.surname}
              onChange={handleChange('surname')}
              required
              aria-invalid={Boolean(errors.surname)}
              aria-describedby={errors.surname ? 'surname-error' : undefined}
            />
            {errors.surname ? (
              <p id="surname-error" className="text-sm text-red-600">
                {errors.surname}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="idNumber">ID Number</Label>
            <Input
              id="idNumber"
              value={values.idNumber}
              onChange={handleChange('idNumber')}
              required
              aria-invalid={Boolean(errors.idNumber)}
              aria-describedby={errors.idNumber ? 'idNumber-error' : undefined}
            />
            {errors.idNumber ? (
              <p id="idNumber-error" className="text-sm text-red-600">
                {errors.idNumber}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-4 rounded-md border border-slate-100 p-4">
          <div>
            <h2 className="text-lg font-medium text-slate-900">Passenger details (optional)</h2>
            <p className="text-sm text-slate-500">If you add a passenger, we need their ID number.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="passengerName">Passenger name</Label>
              <Input
                id="passengerName"
                value={values.passengerName}
                onChange={handleChange('passengerName')}
                aria-invalid={Boolean(errors.passengerName)}
                aria-describedby={errors.passengerName ? 'passengerName-error' : undefined}
              />
              {errors.passengerName ? (
                <p id="passengerName-error" className="text-sm text-red-600">
                  {errors.passengerName}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="passengerSurname">Passenger surname</Label>
              <Input
                id="passengerSurname"
                value={values.passengerSurname}
                onChange={handleChange('passengerSurname')}
                aria-invalid={Boolean(errors.passengerSurname)}
                aria-describedby={errors.passengerSurname ? 'passengerSurname-error' : undefined}
              />
              {errors.passengerSurname ? (
                <p id="passengerSurname-error" className="text-sm text-red-600">
                  {errors.passengerSurname}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="passengerEmail">Passenger email</Label>
              <Input
                id="passengerEmail"
                type="email"
                value={values.passengerEmail}
                onChange={handleChange('passengerEmail')}
                aria-invalid={Boolean(errors.passengerEmail)}
                aria-describedby={errors.passengerEmail ? 'passengerEmail-error' : undefined}
              />
              {errors.passengerEmail ? (
                <p id="passengerEmail-error" className="text-sm text-red-600">
                  {errors.passengerEmail}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="passengerIdNumber">Passenger ID number</Label>
              <Input
                id="passengerIdNumber"
                value={values.passengerIdNumber}
                onChange={handleChange('passengerIdNumber')}
                aria-invalid={Boolean(errors.passengerIdNumber)}
                aria-describedby={errors.passengerIdNumber ? 'passengerIdNumber-error' : undefined}
              />
              {errors.passengerIdNumber ? (
                <p id="passengerIdNumber-error" className="text-sm text-red-600">
                  {errors.passengerIdNumber}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-md border border-slate-100 p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="hasWatchedTutorial"
              checked={values.hasWatchedTutorial}
              onCheckedChange={(checked) => {
                setValues((prev) => ({ ...prev, hasWatchedTutorial: Boolean(checked) }))
                if (errors.hasWatchedTutorial) {
                  setErrors((prev) => ({ ...prev, hasWatchedTutorial: '' }))
                }
              }}
            />
            <div className="space-y-1">
              <Label htmlFor="hasWatchedTutorial" className="font-medium text-slate-900">
                I / we have watched the tutorial video and are prepared to write the Quiz below.
              </Label>
              {errors.hasWatchedTutorial ? (
                <p className="text-sm text-red-600">{errors.hasWatchedTutorial}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-md border border-slate-200 p-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">Waiver and Indemnity</h2>
            <div className="max-h-64 overflow-y-auto rounded border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
              <p className="mb-3">
                I hereby state that I have chosen to take part in the activity being offered by Jet ski and more (Jet ski
                and more Gordon’s Bay) of my own free will.
              </p>
              <p className="mb-3">
                I indemnify Jet ski and more, its members, directors and employees against all claims, losses, demands,
                actions, damages and causes of action whatsoever arising directly or indirectly out of my acts connected
                with or arising out of the Activity, whether suffered by me or any other third party, and I hold Jet ski
                and more harmless there from.
              </p>
              <p className="mb-3">
                I understand that the Activity may be inherently dangerous and may create certain risks to persons that
                can result in property damage and serious physical injury. I further understand that Jet ski and more,
                its officers, employees, and agents will not be and/or are not responsible for any injuries, property
                damage or liability that may arise from my participation in the Activity. I assume full responsibility
                for the decision, and the consequences thereof, to take part in the Activity.
              </p>
              <p className="mb-3">
                I do hereby release, agree to indemnify and hold Jet ski and more, its officers, employees and agents
                free and harmless from any and all costs, losses, expenses, damages (direct, indirect, consequential or
                otherwise), claims, suits, causes of action or any other liability or responsibility whatsoever,
                including attorney’s fees and related costs, resulting from any injury to any person(s) or damage to
                property arising out of, or which may in any manner be connected with, said Activity as provided herein.
              </p>
              <p className="mb-3 font-semibold">Minors</p>
              <p className="mb-3">
                Where the Indemnifying Party is a minor (younger than 18 (eighteen) years), the Indemnifying Party
                agrees to be and has been assisted by a parent/guardian in agreeing to this agreement and such
                parent/guardian has consented to the Indemnifying Party participating in the Activity.
              </p>
              <p className="mb-3">
                I, the parent/guardian of the Indemnifying Party, understand that the Activity is inherently dangerous
                and may create certain risks to persons that can result in property damage and serious physical injury. I
                further understand that Jet ski and more, its officers, employees and agents will not be and/or is not
                responsible for any injuries, property damage or liability that may arise from the Activity.
              </p>
              <p className="mb-3">
                I further assume full responsibility for the decision, and the consequences thereof, to allow my child/the
                minor (the Indemnifying Party) to take part in the Activity as set forth herein. I do hereby release,
                agree to indemnify and hold Jet ski and more, its officers, employees and agents free and harmless from
                any and all costs, losses, expenses, damages, claims, suits, causes of action or any other liability or
                responsibility whatsoever, in law or in equity, including attorney’s fees and related costs, resulting
                from any injury to any person(s) or damage to property arising out of, or which may in any manner be
                connected with, the Activity and my child’s (the Indemnifying Party) participation therein.
              </p>
              <p className="mb-3 font-semibold">Acceptance</p>
              <p className="mb-3">
                I agree that this agreement may be treated as a defense to any action or proceeding that may be brought,
                instituted, or taken by anyone against Jet ski and more, its officers, employees, and agents for injuries
                and/or damages sustained because of the Activity as described herein.
              </p>
              <p className="mb-3">
                I have read this agreement and understand all its terms, and I have executed this instrument voluntarily
                and with full knowledge of its significance. I confirm that I fully appreciate the risks that I may be
                exposed to during my participation in the Activity and that I voluntarily accept such risks.
              </p>
              <p className="mb-3">
                I hereby consent to Jet ski and more and its officers, employees, agents, and third-party service
                providers lawfully collecting, processing, storing and transferring my personal information, as defined
                in the Protection of Personal Information Act 4 of 2013 (POPI) in accordance with POPI and to process
                such information insofar as necessary.
              </p>
              <p>
                By completing this form, you confirm that you have read and understood the meaning and effect of this
                agreement and that you agree to be bound by it from the date of signature. If you do not understand the
                meaning or effect of any of the clauses contained in this agreement, you must request that it be
                explained to you before accepting and concluding this agreement, by contacting: Daniel Mommsen on 074 658
                8885.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox
              id="hasAcceptedIndemnity"
              checked={values.hasAcceptedIndemnity}
              onCheckedChange={(checked) => {
                setValues((prev) => ({ ...prev, hasAcceptedIndemnity: Boolean(checked) }))
                if (errors.hasAcceptedIndemnity) {
                  setErrors((prev) => ({ ...prev, hasAcceptedIndemnity: '' }))
                }
              }}
            />
            <div className="space-y-1">
              <Label htmlFor="hasAcceptedIndemnity" className="font-medium text-slate-900">
                I confirm that I have read, understood and agree to the indemnity and conditions above.
              </Label>
              <p className="text-xs text-slate-500">(required) — please select &ldquo;I agree&rdquo; to proceed.</p>
              {errors.hasAcceptedIndemnity ? (
                <p className="text-sm text-red-600">{errors.hasAcceptedIndemnity}</p>
              ) : null}
            </div>
          </div>
        </div>

        {submitSuccess ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            Thank you, your quiz and indemnity have been submitted.
          </div>
        ) : null}
        {submitError ? (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            {submitError}
          </div>
        ) : null}

        <div className="space-y-4 rounded-md border border-slate-200 p-4">
          <h2 className="text-lg font-semibold text-slate-900">Quiz questions</h2>
          <div className="space-y-4">
            {radioQuestions.map((q) => (
              <div key={q.id} className="space-y-3 rounded-md border border-slate-100 p-4">
                <p className="font-medium text-slate-900">{q.label}</p>
                <div className="space-y-2">
                  {q.options.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        className="h-4 w-4 accent-sky-600"
                        checked={values[q.id as RadioQuestionId] === opt}
                        onChange={() => handleRadioChange(q.id as RadioQuestionId, opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                {errors[q.id as RadioQuestionId] ? (
                  <p className="text-sm text-red-600">{errors[q.id as RadioQuestionId]}</p>
                ) : null}
              </div>
            ))}

            {multiQuestions.map((q) => (
              <div key={q.id} className="space-y-3 rounded-md border border-slate-100 p-4">
                <p className="font-medium text-slate-900">{q.label}</p>
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const checked = values[q.id as MultiQuestionId].includes(opt)
                    return (
                      <label key={opt} className="flex items-center gap-2 text-sm text-slate-700">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleMultiOption(q.id as MultiQuestionId, opt)}
                        />
                        <span>{opt}</span>
                      </label>
                    )
                  })}
                </div>
                {errors[q.id as MultiQuestionId] ? (
                  <p className="text-sm text-red-600">{errors[q.id as MultiQuestionId]}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={submitDisabled}>
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  )
}
