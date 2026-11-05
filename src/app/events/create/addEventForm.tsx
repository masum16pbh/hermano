"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import { format , startOfDay} from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Field,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AddEventForm() {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [name, setName] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [thumbnailUrl, setThumbnailUrl] = React.useState("")
    const [workTypeValue, setWorkTypeValue] = React.useState("donation")
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const workType = [
    { label: "Donation", value: "donation" },
    { label: "Repairing", value: "repairing" },
    { label: "Planting", value: "planting" },
    {label:"Cleaning", value:"cleaning"}
  ]

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const eventInfo = {
            name: name.trim(),
            workType: workTypeValue,
            description: description.trim(),
            thumbnailUrl: thumbnailUrl.trim(),
            date: date ? format(date, "PPP") : null,
        }

        console.log("Event form submitted:", eventInfo)
    }

    function handleClear() {
        setName("")
        setDescription("")
        setThumbnailUrl("")
        setWorkTypeValue("donation")
        setDate(undefined)
        setOpen(false)
    }

    function handleCancel() {
        router.push("/")
    }

    return (
      <div className="container mx-auto">
      
        <form onSubmit={handleSubmit}>

        <Field>
            <FieldLabel htmlFor="input-field-username">Event Name</FieldLabel>
            <Input
              id="input-field-username"
              name="name"
                type="text"
                placeholder="Enter your event name"
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
            <FieldDescription>
                Give a meaningful name of your work
            </FieldDescription>
        </Field>
        <div className="flex justify-baseline gap-2 md:gap-10">

       
            <Field>
            <FieldLabel htmlFor="form-country">Work type</FieldLabel>
            <Select
              items={workType}
              value={workTypeValue}
              onValueChange={(value) => setWorkTypeValue(value ?? "donation")}
            >
              <SelectTrigger id="form-country">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {workType.map((work) => (
                    <SelectItem key={work.value} value={work.value}>
                      {work.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
              <Field>
        <FieldLabel htmlFor="date-picker-optional">Date</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger render={<Button variant="outline" id="date-picker-optional" className="w-32 justify-between font-normal">{date ? format(date, "PPP") : "Select date"}<ChevronDownIcon data-icon="inline-end" /></Button>} />
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              defaultMonth={date}
              disabled={(date) => date < startOfDay(new Date())}
              onSelect={(date) => {
                setDate(date)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>
</div>
        <Field>
      <FieldLabel htmlFor="textarea-message">Event description</FieldLabel>

      <Textarea
        id="textarea-message"
        name="description"
        placeholder="Type your message here."
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
    </Field>
    <Field>
      <FieldLabel htmlFor="input-field-thumbnail">Thumbnail URL</FieldLabel>
      <Input
        id="input-field-thumbnail"
        name="thumbnailUrl"
        type="url"
        placeholder="https://example.com/image.jpg"
        value={thumbnailUrl}
        onChange={(event) => setThumbnailUrl(event.target.value)}
      />
      <FieldDescription>
        Paste a link to the image that represents your event
      </FieldDescription>
    </Field>

      <div className="flex gap-2 my-5 mx-auto">
        <Button type="submit">Submit</Button>
        <Button type="button" variant="outline" onClick={handleClear}>Clear</Button>
        <Button type="button" variant="ghost" onClick={handleCancel}>Cancel</Button>
      </div>
        </form>
          
      </div>
    )
}
