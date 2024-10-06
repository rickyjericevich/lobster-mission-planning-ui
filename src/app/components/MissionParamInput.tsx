import { ComponentPropsWithoutRef } from "react"
import { useFormState } from "react-dom";
import MissionParams from "@/types/MissionParams";

export interface MissionParameterInputProps extends ComponentPropsWithoutRef<"div"> {
    setMissionParams: (missionParams: MissionParams) => void
}

export default function MissionParamaterInput({ setMissionParams, ...props }: MissionParameterInputProps) {

    const [formState, formAction] = useFormState(handleSubmitForm, null);

    function handleSubmitForm(previousState?: any, formData?: FormData) {

        if (!formData) return;

        // convert formdata to object
        const missionParams: { [key: string]: any } = {}
        formData.forEach((val, key) => missionParams[key] = isNaN(+val) ? val : +val) // convert string numbers to numbers (not necessary - API accepts string numbers too)
        console.log("FORMDATA", missionParams)

        // console.log(Object.fromEntries(formData.entries()))
        setMissionParams(missionParams as MissionParams)
    }

    return (
        <div {...props}>

            <h1>Mission Parameters</h1>

            {/* Should probably add a way to select the appropriate robot ? */}

            <form action={formAction}>

                <label>

                    <span className="block">Altitude (m):</span>

                    <input
                        type="number"
                        min={0}
                        max={10}
                        step={0.5}
                        name="altitudeMetres"
                        required
                    // className="mt-1 block w-full text-sm  dark:text-gray-300 dark:border-gray-600"
                    />

                </label>

                <label>

                    <span className="block">Cruise Speed (m/s):</span>

                    <input
                        type="number"
                        min={0}
                        max={10}
                        step={0.5}
                        name="cruiseSpeedMetresPerSecond"
                        required
                    // className="mt-1 block w-full text-sm  dark:text-gray-300 dark:border-gray-600"
                    />

                </label>

                <label>

                    <span className="block">Water current heading (degrees measured clockwise from true north):</span>

                    <input
                        type="number"
                        min={0}
                        max={10}
                        step={1}
                        name="waterCurrentDirectionMetresPerSecond"
                        required
                    // className="mt-1 block w-full text-sm  dark:text-gray-300 dark:border-gray-600"
                    />

                </label>

                <button type="submit">Save</button>

            </form>
        </div>
    )

}