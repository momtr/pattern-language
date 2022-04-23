import './Form.css';
import Header from '../Header/Header';
import { useEffect, useRef, useState } from "react";
import Select from 'react-select';
import { FormProvider, useFieldArray, useForm, useFormContext, Controller } from "react-hook-form";
import { TiDelete } from 'react-icons/ti';
import makeAnimated from 'react-select/animated';
import { getAllPatterns } from '../../api/patterns';
import { yupResolver } from '@hookform/resolvers/yup';
import { formSchema } from './schema';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';

export default function Form() {

    // sections
    const sections = [
        { key: 'PERSONAL_DATA', name: 'Meine Daten' },
        { key: 'ADD', name: 'Muster beschreiben' },
        { key: 'PREVIEW', name: 'Vorschau' },
    ];
    const [current, setCurrent] = useState(0);

    // form
    const formMethods = useForm({
        resolver: yupResolver(formSchema)
    });
    const { handleSubmit, watch, register, formState: { errors } } = formMethods;
    const form = watch();
    const onSubmit = values => setCurrent(2);

    // control functions
    function goToNextSection() {
        if (current != sections.length - 1)
            setCurrent(current + 1);
    }

    function goToPreviousSection() {
        if (current >= 0)
            setCurrent(current - 1);
    }

    // reference patterns
    const [patterns, setPatterns] = useState([]);
    const animatedComponents = makeAnimated();

    useEffect(() => {
        fetchPatterns();
    }, []);

    function fetchPatterns() {
        getAllPatterns()
            .then(data => {
                setPatterns(data.patterns);
            })
            .catch(err => {
                alert('Ein unerwarteter Fehler ist aufgetreten: ' + err);
            })
    }

    // overview
    const overviewRef = useRef();

    function getSectionCode() {
        switch (current) {
            case 0:
                return (<>
                    <div><span className="red">*</span> erforderliches Feld</div>
                    <h2>Offizieller Name</h2>
                    <label htmlFor="_title">Titel</label>
                    <input id="input-_title" className="form-grp-input" type="text" name="_title" {...register("_title")} />
                    {errors._title && <div className="error-msg">{errors._title.message}</div>}
                    <label htmlFor="_firstName">Vorname <span className="red">*</span></label>
                    <input id="input-_firstName" className="form-grp-input" type="text" name="_firstName" {...register("_firstName")} />
                    {errors._firstName && <div className="error-msg">{errors._firstName.message}</div>}
                    <label htmlFor="_lastName">Nachname <span className="red">*</span></label>
                    <input className="form-grp-input" type="text" name="_lastName" {...register("_lastName")} />
                    {errors._lastName && <div className="error-msg">{errors._lastName.message}</div>}

                    <h2>Adresse</h2>
                    <label htmlFor="_street">Straße</label>
                    <input className="form-grp-input" type="text" name="_street" {...register("_street")} />
                    {errors._street && <div className="error-msg">{errors._street.message}</div>}
                    <label htmlFor="_postalCode">Postleitzahl</label>
                    <input className="form-grp-input" type="text" name="_postalCode" {...register("_postalCode")} />
                    {errors._postalCode && <div className="error-msg">{errors._postalCode.message}</div>}
                    <label htmlFor="_place">Ort</label>
                    <input className="form-grp-input" type="text" name="_place" {...register("_place")} />
                    {errors._place && <div className="error-msg">{errors._place.message}</div>}

                    <h2>Kontakt</h2>
                    <label htmlFor="_email">E-Mail Adresse <span className="red">*</span></label>
                    <input className="form-grp-input" type="email" name="_email" {...register("_email")} />
                    {errors._email && <div className="error-msg">{errors._email.message}</div>}
                    <label htmlFor="_telephone">Telefon</label>
                    <input className="form-grp-input" type="text" name="_telephone" {...register("_telephone")} />
                    {errors._telephone && <div className="error-msg">{errors._telephone.message}</div>}

                    <h2>Zustimmung</h2>
                    <input type="checkbox" name="_acceptData" {...register("_acceptData")} />
                    <label htmlFor="_acceptData">Ich akzeptiere die Datenschutzbedingungen und bin weiters damit einverstanden, dass ich per E-Mail Informationen erhalten werde.</label>
                    {errors._acceptData && <div className="error-msg">{errors._acceptData.message}</div>}
                    <button className="action-btn" type="button" onClick={goToNextSection}>Weiter <BsArrowRight /></button>

                </>)
                break;
            case 1:
                return (<>
                    <div><span className="red">*</span> erforderliches Feld</div>
                    <h2>Allgemein</h2>
                    <label htmlFor="patternHeading">Title des Musters <span className="red">*</span></label>
                    <input id="input-patternHeading" className="form-grp-input" type="text" name="patternHeading" {...register("patternHeading")} />
                    {errors.patternHeading && <div className="error-msg">{errors.patternHeading.message}</div>}
                    <label htmlFor="patternId">Arbeitsnummer <span className="red">*</span></label>
                    <input id="input-patternId" className="form-grp-input" type="text" name="patternId" {...register("patternId")} />
                    {errors.patternId && <div className="error-msg">{errors.patternId.message}</div>}
                    <label htmlFor="mainMessage">Kernaussage <span className="red">*</span></label>
                    <textarea className="form-grp-textarea text-8r" type="text" name="mainMessage" {...register("mainMessage")} />
                    {errors.mainMessage && <div className="error-msg">{errors.mainMessage.message}</div>}
                    <label htmlFor="referencePatterns1">Andere Patterns referenzieren</label>
                    <Controller
                        control={formMethods.control}
                        name={"referencePatterns1"}
                        defaultValue={1}
                        render={params => (
                            <Select
                                inputRef={params.field.ref}
                                className="select-box"
                                options={patterns.map(i => ({ value: i, label: i.text }))}
                                value={patterns.find(c => params.field.value == c)}
                                onChange={val => params.field.onChange(val.map(c => c.value))}
                                isMulti
                            />
                        )}
                    />
                    {errors.referencePatterns1 && <div className="error-msg">{errors.referencePatterns1.message}</div>}
                    <label htmlFor="titleImage">Titelbild <span className="red">*</span></label>
                    <input className="form-grp-input" type="file" name="titleImage" accept=".jpg,.jpeg,.png" {...register("titleImage")} />
                    {
                        form.titleImage && form.titleImage[0] && <img src={window.URL.createObjectURL(form.titleImage[0])} width="100%" />
                    }
                    {errors.titleImage && <div className="error-msg">{errors.titleImage.message}</div>}
                    <label htmlFor="problemStatement">Problemstatement <span className="red">*</span></label>
                    <textarea className="form-grp-textarea text-20r" type="text" name="problemStatement" {...register("problemStatement")} />
                    {errors.problemStatement && <div className="error-msg">{errors.problemStatement.message}</div>}

                    <Discussion />

                    <h2>Lösungsansatz</h2>
                    <label htmlFor="solution">Text <span className="red">*</span></label>
                    <textarea className="form-grp-textarea text-8r" type="text" name="solution" {...register("solution")} />
                    {errors.solution && <div className="error-msg">{errors.solution.message}</div>}
                    <label htmlFor="sketch"> Skizze<span className="red">*</span></label>
                    <input className="form-grp-input" type="file" name="sketch" accept=".jpg,.jpeg,.png" {...register("sketch")} />
                    {
                        form.sketch && form.sketch[0] && <img src={window.URL.createObjectURL(form.sketch[0])} width="100%" />
                    }
                    {errors.sketch && <div className="error-msg">{errors.sketch.message}</div>}

                    <h2>Weiterführend</h2>
                    <label htmlFor="more">An was noch zu denken ist <span className="red">*</span></label>
                    <textarea className="form-grp-textarea text-8r" type="text" name="more" {...register("more")} />
                    {errors.more && <div className="error-msg">{errors.more.message}</div>}
                    <label htmlFor="referencePatterns2">Andere Patterns referenzieren</label>
                    <Controller
                        control={formMethods.control}
                        name={"referencePatterns2"}
                        defaultValue={1}
                        render={params => (
                            <Select
                                inputRef={params.field.ref}
                                className="select-box"
                                options={patterns.map(i => ({ value: i, label: i.text }))}
                                value={patterns.find(c => params.field.value == c)}
                                onChange={val => params.field.onChange(val.map(c => c.value))}
                                isMulti
                            />
                        )}
                    />
                    {errors.referencePatterns2 && <div className="error-msg">{errors.referencePatterns2.message}</div>}
                    <label htmlFor="sourcs">Quellen / Literatur <span className="red">*</span></label>
                    <textarea className="form-grp-textarea text-8r" type="text" name="sourcs" {...register("sourcs")} />
                    {errors.sourcs && <div className="error-msg">{errors.sourcs.message}</div>}

                    <button type="button" onClick={goToPreviousSection}><BsArrowLeft /> Zurück</button>
                    <button type="submit" onClick={() => console.log(errors)}>Weiter <BsArrowRight /></button>

                    {(Object.keys(errors).length != 0) && <div className="error-box error-msg">Bitte füllen Sie alle Felder im Formular korrekt aus. Gehen Sie gegebenenfalls auf die <b onClick={() => setCurrent(0)}>Seite "Meine Daten" zurück.</b></div>}
                </>)
            default:
                return (<div className="pattern-preview" ref={overviewRef}>
                    <h1>{form.patternId} - {form.patternHeading}</h1>
                    <p>{form.mainMessage}</p>
                    {form.referencePatterns1 && form.referencePatterns1.length > 0 && <>
                        <p>Verwandte Patterns:</p>
                        <ul>
                            {form.referencePatterns1.map((pattern, key) => (
                                <li key={key}><a href={pattern.link}>{pattern.pattern_language}: {pattern.text}</a></li>
                            ))}
                        </ul>
                    </>}
                    <div>
                        <img src={window.URL.createObjectURL(form.titleImage[0])} width="100%" alt="Titelbild" />
                    </div>
                    <div className="black-diamond">
                        ❖ ❖ ❖
                    </div>
                    <p>{form.problemStatement}</p>

                    <h3>DISKUSSION</h3>
                    {form.items && form.items.map((item, key) => {
                        if (item.type === "text") {
                            return (
                                <div key={key}>
                                    <p>{item.value}</p>
                                </div>
                            )
                        } else if (item.type === "img") {
                            return (
                                <div key={key}>
                                    <img src={window.URL.createObjectURL(item.value[0])} width="100%" alt="Diskussions-Bild" />
                                    <div className="image-description">{item.description}</div>
                                </div>
                            )
                        } else {
                            return (<div key={key} className="two-img-section">
                                <div className="two-img">
                                    <img src={window.URL.createObjectURL(item.value1[0])} width="100%" alt="Diskussions-Bild" />
                                    <div className="image-description">{item.description1}</div>
                                </div>
                                <div className="two-img">
                                    <img src={window.URL.createObjectURL(item.value2[0])} width="100%" alt="Diskussions-Bild" />
                                    <div className="image-description">{item.description2}</div>
                                </div>
                            </div>
                            )
                        }
                    })}

                    <h3>LÖSUNGSANSATZ</h3>
                    <p>{form.solution}</p>
                    <div>
                        <img src={window.URL.createObjectURL(form.sketch[0])} width="100%" alt="Titelbild" />
                    </div>

                    <div className="black-diamond">
                        ❖ ❖ ❖
                    </div>

                    <h3>WEITERFÜHREND</h3>
                    <p>{form.more}</p>
                    {form.referencePatterns2 && form.referencePatterns2.length > 0 && <>
                        <p>Verwandte Patterns:</p>
                        <ul>
                            {form.referencePatterns2.map((pattern, key) => (
                                <li key={key}><a href={pattern.link}>{pattern.pattern_language}: {pattern.text}</a></li>
                            ))}
                        </ul>
                    </>}

                    <h3>QUELLEN / LITERATUR</h3>
                    <p>{form.sourcs}</p>

                    <button onClick={() => console.log(0)}>log</button>

                </div>)
        }
    }

    return (
        <>
            <Header />
            <div className="New">
                <div className="nav-section">
                    <h1>Erstellen eines neuen Musters</h1>
                    <p className="text-light">
                        Füllen Sie die vorgegebenen Felder aus. Nachdem Sie das Formular an uns gesandt und wir es empfangen haben, erhalten Sie ein Bestätigungsmail. Ihr Beitrag wird anschließend auf der Seite "Vorgeschlagene Muster" gelistet.
                    </p>
                    <div className="navbar">
                        {
                            sections.map((v, _key) => (
                                <div className={`navbar-item ${current !== _key ? 'navbar-inactive' : ''}`} key={v.key} onClick={() => {
                                    if (_key === 0 || _key === 1)
                                        setCurrent(_key)
                                }}>
                                    <div className="navbar-item-num">{_key + 1}</div>
                                    <div className="navbar-item-text">{v.name}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="form-section">
                    <div className="form-title">{sections[current].name}</div>
                    <FormProvider {...formMethods}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {getSectionCode()}
                            <br></br>
                        </form>
                    </FormProvider>
                </div>
            </div>
            <div className="footer">
                <p>Pattern Editor</p>
                <a href="https://pattern-language.wiki">Zur Startseite</a>
                <p className="legal">(c) 2022 pattern-language.wiki. Alle Rechte vorbehalten.</p>
            </div>
        </>
    )

}


function Discussion() {
    const { control, register, watch, formState: { errors } } = useFormContext();
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control,
        name: "items"
    });
    const items = watch("items");

    function getItem(item, key) {
        switch (item.type) {
            case 'text':
                return (
                    <textarea className="form-grp-textarea text-8r" type="text" name={`items[${key}].value`} {...register(`items[${key}].value`)} />
                )
                break;
            case 'img':
                return (<>
                    <input className="form-grp-input" type="file" name={`items[${key}].value`} accept=".jpg,.jpeg,.png" {...register(`items[${key}].value`)} />
                    {
                        items[key].value && items[key].value[0] && <img src={window.URL.createObjectURL(items[key].value[0])} width="100%" />
                    }
                    <label htmlFor={`items[${key}].description`}>Bildbeschreibung</label>
                    <input name={`items[${key}].description`} className="form-grp-input" type="text" {...register(`items[${key}].description`)} />
                </>)
                break;
            case '2img':
                return (
                    <div className="two-img-section">
                        <div className="two-img">
                            <input className="form-grp-input" type="file" name={`items[${key}].value1`} accept=".jpg,.jpeg,.png" {...register(`items[${key}].value1`)} />
                            {
                                items[key].value1 && items[key].value1[0] && <img src={window.URL.createObjectURL(items[key].value1[0])} width="100%" />
                            }
                            <label htmlFor={`items[${key}].description1`}>Bildbeschreibung 1</label>
                            <input name={`items[${key}].description1`} className="form-grp-input" type="text" {...register(`items[${key}].description1`)} />
                        </div>
                        <div className="two-img">
                            <input className="form-grp-input" type="file" name={`items[${key}].value2`} accept=".jpg,.jpeg,.png" {...register(`items[${key}].value2`)} />
                            {
                                items[key].value2 && items[key].value2[0] && <img src={window.URL.createObjectURL(items[key].value2[0])} width="100%" />
                            }
                            <label htmlFor={`items[${key}].description2`}>Bildbeschreibung 2</label>
                            <input name={`items[${key}].description2`} className="form-grp-input" type="text" {...register(`items[${key}].description2`)} />
                        </div>
                    </div>
                )
                break;
            default:
                return (<div>Ein Fehler ist aufgetreten! Bitte kontaktieren Sie den Administrator.</div>)
        }
    }

    return (
        <>
            <h2>Diskussion</h2>
            <div>
                <button type="button" onClick={() => append({ uuid: uuidv4(), type: 'text', value: '' })}>Textabschnitt einfügen</button>
                <button type="button" onClick={() => append({ uuid: uuidv4(), type: '2img', value1: '', value2: '' })}>2 Bilder einfügen</button>
                <button type="button" onClick={() => append({ uuid: uuidv4(), type: 'img', value: '' })}>Bild einfügen</button>
            </div>
            {items && items.map((item, key) => (
                <div key={item.uuid}>
                    <button className="delete-button" type="button" onClick={() => remove(key)}>
                        Abschnitt {key} löschen <TiDelete />
                    </button>
                    {getItem(item, key)}

                </div>
            ))}
            {errors.items && errors.items.message && <div className="error-msg">{errors.items.message}</div>}
        </>
    )
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
