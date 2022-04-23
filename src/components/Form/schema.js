import React from "react";
import { useForm } from "react-hook-form";
import { SiYamahacorporation } from "react-icons/si";
import * as yup from "yup";

const REQUIRED_FIELD_TEXT = "Bitte füllen Sie dieses Feld aus!";

export const itemSchema = yup.object().shape({
    type: yup.string().required(REQUIRED_FIELD_TEXT),
    uuid: yup.string().required(REQUIRED_FIELD_TEXT),
    value: yup.mixed().optional(),
    value1: yup.object().nullable().optional(),
    value2: yup.object().nullable().optional(),
    description: yup.string().optional(),
    description1: yup.string().optional(),
    description2: yup.string().optional()
});

export const patternSchema = yup.object().shape({
    lang: yup.string().required(REQUIRED_FIELD_TEXT),
    link: yup.string().required(REQUIRED_FIELD_TEXT),
    pattern_language: yup.string().required(REQUIRED_FIELD_TEXT),
    text: yup.string().required(REQUIRED_FIELD_TEXT),
})

export const formSchema = yup.object({
    items: yup.array(itemSchema),
    patternId: yup.string().required(REQUIRED_FIELD_TEXT),
    mainMessage: yup.string().required(REQUIRED_FIELD_TEXT),
    more: yup.string().required(REQUIRED_FIELD_TEXT),
    patternHeading: yup.string().required(REQUIRED_FIELD_TEXT),
    problemStatement: yup.string().required(REQUIRED_FIELD_TEXT),
    referencePatterns1: yup.array(patternSchema).nullable().optional(),
    referencePatterns2: yup.array(patternSchema).nullable().optional(),
    solution: yup.string().required(REQUIRED_FIELD_TEXT),
    sourcs: yup.string().required(REQUIRED_FIELD_TEXT),
    _acceptData: yup.boolean().required(REQUIRED_FIELD_TEXT).oneOf([true], "Die Bedingungen müssen akzeptiert werden, um fortzufahren!"),
    _email: yup.string().email("Bitte geben Sie eine gültige E-Mail Adresse an!").required(REQUIRED_FIELD_TEXT),
    _firstName: yup.string().required(REQUIRED_FIELD_TEXT),
    _lastName: yup.string().required(REQUIRED_FIELD_TEXT),
    _place: yup.string().optional(),
    _postalCode: yup.string().optional(),
    _street: yup.string().optional(),
    _telephone: yup.string().optional(),
    _title: yup.string().optional(),
    sketch: yup.mixed().required('Bitte fügen Sie eine Datei an!')
        .test('file', 'Bitte fügen Sie eine Datei an. Die maximale Dateigröße beträgt 2MB.', (value) => {
            if(!value[0]) return false;
            return value[0].size <= 2000000
        }),
    titleImage:  yup.mixed().required('Bitte fügen Sie eine Datei an!')
        .test('file', 'Bitte fügen Sie eine Datei an! Die maximale Dateigröße beträgt 2MB.', (value) => {
            if(!value[0]) return false;
            return value[0].size <= 2000000
        }),
}).required();

/*
items: (4) [{…}, {…}, {…}, {…}]
mainMessage: "Das ist die Kernaussage\n\nsdfs\nsdfdsf"
more: "An das ist noch weiter zu denken"
patternHeading: "asdasdasdas"
problemStatement: "Das ust das Problemstatement"
referencePatterns1: (3) [{…}, {…}, {…}]
referencePatterns2: (2) [{…}, {…}]

solution: "Das ist die Lösung"
sourcs: "Quellen"
_acceptData: true
_email: "mitterdorer.moritz@gmail.com"
_firstName: "Moritz"
_lastName: "MItterdorfer"
_place: "Wien"
_postalCode: "1150"
_street: "Wurmsergasse 6/9"
_telephone: "06605056961"
_title: "Dr."

sketch: FileList {0: File, length: 1}
titleImage: FileList {0: File, length: 1}
*/
