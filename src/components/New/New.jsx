import './New.css';
import Header from '../Header/Header';
import {useEffect, useState} from "react";
import { getAllPatterns } from '../../api/patterns';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();
function PatternList({ valueSubmit }) {
    const [patterns, setPatterns] = useState([]);

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
    
    return (
      <Select
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti
        options={patterns.map(i => ({ value: i, label: i.text }))}
        onChange={valueSubmit} 
      />
    );
  }

function New() {

    const sections = [
        { key: 'PERSONAL_DATA', name: 'Meine Daten', required: [
            { key: 'firstname', msg: 'Bitte Vornamen angeben!' },
            { key: 'lastname', msg: 'Bitte Nachnamen angeben!' },
            { key: 'email', msg: 'Bitte E-Mail Adresse angeben!' },
            { key: 'dataprivacy', msg: 'Um fortzufahren, müssen Sie den Datenschutzbedingungen zustimmen.' },
            { key: 'emailaccept', msg: 'Um fortzufahren, müssen Sie zustimmen, dass wir Ihnen Informationen per E-Mail senden dürfen.' }
         ]},
        { key: 'ADD', name: 'Muster beschreiben', required: [] },
        { key: 'PREVIEW', name: 'Vorschau' },
    ];

    

    const [current, setCurrent] = useState(0);
    const [data, setData] = useState({ discusion: [{ type: 'text', value: ''}] });
    const [discusion, setDiscussion] = useState([{
        type: 'TEXT', value: ''
    }]);

    function getSection(id) {
        return sections.find(v => v.key === id);
    }

    function validate(id) {
        for(let i of getSection(id).required) {
            if(!data[i.key]) {
                alert(i.msg);
                return false;
            }
        }
        return true;
    }

    function navigate(id) {
        switch(id) {
            case 'ADD':
                if(validate('PERSONAL_DATA')) {
                    setCurrent(1);
                }
                break;
            case 'PREVIEW':
                if(validate('ADD')) {
                    setCurrent(2);
                }
                break;
            default:
                return;
        }
    }

    function navigateBack(id) {
        switch(id) {
            case 'PERSONAL_DATA':
                setCurrent(0);
                break;
            case 'ADD':
                setCurrent(1);
                break;
            default: 
                return;
        }
    }

    function getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    function onImageUpload(event, storeKey) {
        if(event.target.files && event.target.files[0] && (event.target.files[0].type === 'image/jpeg' || event.target.files[0].type === 'image/png')) {
            const img = event.target.files[0];
            console.log(img.type)
            getBase64(img, link => {
                const newData = { ...data };
                newData[storeKey] = link;
                setData(newData);
            })
        } else {
            alert('Bitte eine Bild-Datei hochladen! (png, jpeg)');
            event.currentTarget.value = null
        }
    }

    function onImageUploadWithCallback(event, callback) {
        console.log(event);
        if(event.target.files && event.target.files[0] && (event.target.files[0].type === 'image/jpeg' || event.target.files[0].type === 'image/png')) {
            const img = event.target.files[0];
            getBase64(img, link => callback(link))
        } else {
            alert('Bitte eine Bild-Datei hochladen! (png, jpeg)');
            event.currentTarget.value = null
        }
    }

    function handleAddReference(event, section) {
        let newData = data;
        newData[`${section}_referenced_patterns`] = event;
        setData(newData);
        console.log(data);
    }

    function log() {
        console.log(data);
        return <p>hi</p>
    }

    function renderForm(id) {
        switch(id) {
            case 'PERSONAL_DATA':
                return (<>
                    <p className="text-light"><span className="red">*</span> erforderliches Feld</p>
                    <div className="form-sub-title">Offizieller Name</div>
                    <div className="form-grp">
                        <div className="form-grp-label">Titel</div>
                        <input className="form-grp-input" onChange={(e) => setData({ ...data, title: e.target.value })}></input>
                    </div>
                    <div className="form-grp">
                        <div className="form-grp-label">Vorname <span className="red">*</span></div>
                        <input className="form-grp-input" onChange={(e) => setData({ ...data, firstname: e.target.value })}></input>
                    </div>
                    <div className="form-grp">
                        <div className="form-grp-label">Nachname <span className="red">*</span></div>
                        <input className="form-grp-input" onChange={(e) => setData({ ...data, lastname: e.target.value })}></input>
                    </div>
                    <div className="form-sub-title">Adresse</div>
                    <div className="form-grp">
                        <div className="form-grp-label">Straße</div>
                        <input className="form-grp-input" onChange={(e) => setData({ ...data, street: e.target.value })}></input>
                    </div>
                    <div className="form-grp">
                        <div className="form-grp-label">Postleitzahl</div>
                        <input className="form-grp-input" onChange={(e) => setData({ ...data, zip: e.target.value })}></input>
                    </div>
                    <div className="form-grp">
                        <div className="form-grp-label">Ort</div>
                        <input className="form-grp-input" onChange={(e) => setData({ ...data, place: e.target.value })}></input>
                    </div>
                    <div className="form-sub-title">Kontakt</div>
                    <div className="form-grp">
                        <div className="form-grp-label">E-Mail Adresse<span className="red">*</span></div>
                        <input className="form-grp-input" onChange={(e) => setData({ ...data, email: e.target.value })}></input>
                    </div>
                    <div className="form-grp">
                        <div className="form-grp-label">Telefon Ländervorwahl</div>
                        <input className="form-grp-input" onChange={(e) => setData({ ...data, telcountry: e.target.value })}></input>
                    </div>
                    <div className="form-grp">
                        <div className="form-grp-label">Telefonnummer</div>
                        <input className="form-grp-input" onChange={(e) => setData({ ...data, tel: e.target.value })}></input>
                    </div>
                    <div className="form-sub-title">Zustimmung</div>
                    <div className="form-grp">
                        <div>
                            <input id="confirm" type="checkbox" />
                            <label className="text-light" for="confirm" onClick={() => setData({ ...data, dataprivacy: data.dataprivacy ? false : true })}>Ich akzeptiere die Datenschutzbedingungen. <span className="red">*</span></label>
                        </div>
                        <div>
                            <input id="email" type="checkbox" />
                            <label className="text-light" for="email" onClick={() => setData({ ...data, emailaccept: data.emailaccept ? false : true })}>Ich bin einverstanden, dass ich per E-Mail Informationen erhalten werde. <span className="red">*</span></label>
                        </div>
                    </div>
                    <div className="form-grp">
                        <button className="form-button" onClick={() => navigate('ADD')}>Weiter</button>
                    </div>
                </>);
            case 'ADD':
                return (<>
                    <p className="text-light"><span className="red">*</span> erforderliches Feld</p>
                    <div className="form-sub-title">Allgemein</div>
                    <div className="form-grp">
                        <div className="form-grp-label">Titel des Musters <span className="red">*</span></div>
                        <input className="form-grp-input" onChange={(e) => setData({ ...data, pattern_title: e.target.value })}></input>
                    </div>
                    <div className="form-grp">
                        <div className="form-grp-label">Kernaussage <span className="red">*</span></div>
                        <textarea className="form-grp-textarea text-8r" onChange={(e) => setData({ ...data, pattern_mainpoint: e.target.value })}></textarea>
                        <p>Andere Patterns referenzieren:</p>
                        <PatternList valueSubmit={(e) => handleAddReference(e, 'pattern_mainpoint')} />
                    </div>
                    <div className="form-grp">
                        <div className="form-grp-label">Titelbild <span className="red">*</span></div>
                        <input type="file" className="form-grp-input" onChange={(e) => onImageUpload(e, 'titleImageBase64')}></input>
                        {
                            data.titleImageBase64 ? <img src={data.titleImageBase64} width="100%" /> : ""
                        }
                    </div>
                    <div className="form-grp">
                        <div className="form-grp-label">Problemstatement <span className="red">*</span></div>
                        <textarea className="form-grp-textarea text-20r" onChange={(e) => setData({ ...data, pattern_problemstatement: e.target.value })}></textarea>
                    </div>
                
                    <div className="form-sub-title">Diskussion</div>
                    <div className="form-grp">
                        <button onClick={() => {
                            setDiscussion([ ...discusion, { type: 'TEXT', value: '' }])
                            setData({ ...data, discussion: [ ...data.discussion, { type: 'text', value: '' } ] })
                        }}>Textabschnitt einfügen</button>
                        <button onClick={() => {
                            setDiscussion([ ...discusion, { type: '3-IMG', value: '' }])}
                            // todo
                        }>3 Bilder einfügen</button>
                        <button onClick={() => { 
                            setDiscussion([ ...discusion, { type: '1-IMG', value: '' }])
                            setData({ ...data, discussion: [ ...data.discussion, { type: 'tex1-IMGt', value: '' } ] })
                        }}>1 Bild einfügen</button>
                    </div>
                    <div className="form-grp">
                        {
                            discusion.map((v, key) => {
                                return (
                                    <div className="form-grp" key={key}>
                                        {
                                            (v.type === 'TEXT' ? (
                                                <textarea className="form-grp-textarea text-8r" onChange={(e) => {
                                                    let currentDiscussion = [ ...discusion ];
                                                    currentDiscussion[key].value = e.target.value;
                                                    setDiscussion(currentDiscussion);

                                                    if(!data.discussion) {
                                                        setData({ ...data, discussion: [ { type: 'text', value: e.target.value } ] })
                                                    } else if(!data.discussion[key]){
                                                        setData({ ...data, discussion: [ ...data.discussion, { type: 'text', value: e.target.value } ] })
                                                    } else {
                                                        let discussionByKey = data.discussion;
                                                        discussionByKey[key].value = e.target.value;
                                                        setData({ ...data, discussion: discussionByKey });
                                                    }
                                                }}></textarea>
                                            ) : (v.type === '3-IMG') ? (
                                                <div className="three-img-section">
                                                    <div className="three-img">
                                                        <input type="file" className="form-grp-input" onChange={(e) => {
                                                            onImageUpload(e, `discussion-${key}-1`)
                                                            
                                                        }}></input>
                                                        {
                                                            data[`discussion-${key}-1`] ? <img src={data[`discussion-${key}-1`]} width="100%" /> : ""
                                                        }
                                                    </div>
                                                    <div className="three-img">
                                                        <input type="file" className="form-grp-input" onChange={(e) => onImageUpload(e, `discussion-${key}-2`)}></input>
                                                        {
                                                            data[`discussion-${key}-2`] ? <img src={data[`discussion-${key}-2`]} width="100%" /> : ""
                                                        }
                                                    </div>
                                                    <div className="three-img">
                                                        <input type="file" className="form-grp-input" onChange={(e) => onImageUpload(e, `discussion-${key}-3`)}></input>
                                                        {
                                                            data[`discussion-${key}-3`] ? <img src={data[`discussion-${key}-3`]} width="100%" /> : ""
                                                        }
                                                    </div>
                                                </div>
                                            ) 
                                            : (<>
                                                <input type="file" className="form-grp-input" onChange={(e) => {
                                                    onImageUploadWithCallback(e, (link) => {
                                                        if(!data.discussion) {
                                                            setData({ ...data, discussion: [ { type: '1-IMG', value: link } ] })
                                                        } else if(!data.discussion[key]) {
                                                            setData({ ...data, discussion: [ ...data.discussion, { type: '1-IMG', value: link } ] })
                                                        } else {
                                                            let discussionByKey = data.discussion;
                                                            discussionByKey[key].value = link;
                                                            setData({ ...data, discussion: discussionByKey });
                                                        }
                                                    })
                                                }}></input>
                                                {
                                                    // bug here
                                                    log()
                                                }
                                            </>))
                                        }    
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className="form-sub-title">Lösungsansatz</div>
                    <div className="form-grp">
                        <div className="form-grp-label">Text <span className="red">*</span></div>
                        <textarea className="form-grp-textarea text-8r" onChange={(e) => setData({ ...data, pattern_solution: e.target.value })}></textarea>
                    </div>
                    <div className="form-grp">
                        <div className="form-grp-label">Bild <span className="red">*</span></div>
                        <input type="file" className="form-grp-input" onChange={(e) => onImageUpload(e, 'solutionImageBase64')}></input>
                        {
                            data.solutionImageBase64 ? <img src={data.solutionImageBase64} width="100%" /> : ""
                        }
                    </div>

                    <div className="form-sub-title">Weiterführend</div>
                    <div className="form-grp">
                        <div className="form-grp-label">An was noch zu denken ist <span className="red">*</span></div>
                        <textarea className="form-grp-textarea text-8r" onChange={(e) => setData({ ...data, pattern_thinkahead: e.target.value })}></textarea>
                        <p>Andere Patterns referenzieren:</p>
                        <PatternList valueSubmit={(e) => handleAddReference(e, 'pattern_thinkahead')} />
                    </div>

                    <div className="form-sub-title">Abschließend</div>
                    <div className="form-grp">
                        <div className="form-grp-label">Verweise und Fußnoten <span className="red">*</span></div>
                        <textarea className="form-grp-textarea text-8r" onChange={(e) => setData({ ...data, pattern_references: e.target.value })}></textarea>
                    </div>

                    <div className="form-grp">
                        <button className="form-button" onClick={() => navigate('PREVIEW')}>Zur Vorschau</button>
                    </div>
                    <div className="form-grp">
                        <button className="form-button" onClick={() => navigateBack('PERSONAL_DATA')}>Zurück</button>
                    </div>
                </>)
                break;
            case 'PREVIEW':
                return (<>
                    <h1>{data.title}</h1>
                    <div className="preview-pattern">

                        <div className="prev-pattern_title">{data.pattern_title}</div>
                        <div className="prev-pattern_mainpoint">{data.pattern_mainpoint}</div>
                        <ul className="prev-pattern_mainpoint-links">
                            {
                                data.pattern_mainpoint_referenced_patterns && data.pattern_mainpoint_referenced_patterns.map((val, key) => (
                                    <li key={key}>{val.value.text}</li>
                                ))
                            }
                        </ul>
                        <div className="pre-img-container">
                            <img className="prev-titleImageBase64" width="100%" src={data.titleImageBase64} alt={data.pattern_title} />
                        </div>
                        <div className="prev-pattern_problemstatement">{data.pattern_problemstatement}</div>
                        <p>- Diskussion -</p>
                        <div className="prev-pattern_solution">{data.pattern_solution}</div>
                        <div className="pre-img-container">
                            <img className="prev-solutionImageBase64" width="100%" src={data.solutionImageBase64} alt="Lösungsansatz" />
                        </div>
                        <div className="prev-pattern_thinkahead">{data.pattern_thinkahead}</div>
                        <ul className="prev-pattern_mainpoint-links">
                            {
                                data.pattern_thinkahead_referenced_patterns && data.pattern_thinkahead_referenced_patterns.map((val, key) => (
                                    <li key={key}>{val.value.text}</li>
                                ))
                            }
                        </ul>
                        <div className="prev-pattern_references">{data.pattern_references}</div>

                    </div>
                    <div>
                        <div className="form-grp">
                            <button className="form-button">Absenden</button>
                        </div>
                        <div className="form-grp">
                            <button className="form-button" onClick={() => navigateBack('ADD')}>Zurück</button>
                        </div>
                    </div>
                    <div className="clear"></div>
                </>)
                break;
            default:
                return (<h1>Error!</h1>)
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
                            <div className={`navbar-item ${current !== _key ? 'navbar-inactive' : ''}`} key={v.key}>
                                <div className="navbar-item-num">{_key + 1}</div>
                                <div className="navbar-item-text">{v.name}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="form-section">
                <div className="form-title">{sections[current].name}</div>
                <div className="form-fields">
                    {renderForm(sections[current].key)}
                </div>
            </div>
        </div>
        </>
    )
}

export default New;
