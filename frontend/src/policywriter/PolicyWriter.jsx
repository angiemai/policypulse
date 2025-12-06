// src/policywriter/PolicyWriter.jsx
import React, {useRef, useState, useCallback, useEffect} from 'react'
import {
    FaBold,
    FaItalic,
    FaUnderline,
    FaAlignLeft,
    FaAlignCenter,
    FaAlignRight,
    FaImage,
    FaStrikethrough, FaListUl, FaListOl, FaAlignJustify
} from 'react-icons/fa'
import { ArrowLeft, Eye, Save, Tags } from 'lucide-react';
import Image from '@tiptap/extension-image'
import StarterKit from "@tiptap/starter-kit";
import Highlight  from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color"
import TextAlign from '@tiptap/extension-text-align'
import {useEditor, EditorContent, useEditorState} from '@tiptap/react'
import './PolicyWriter.css'
import axios from "axios"
import debounce from "lodash.debounce"
import { useNavigate, useParams, Link} from 'react-router-dom';
import {useQuery} from "@tanstack/react-query";
import {queryClient} from "../main.jsx"
import { LeftOutlined } from '@ant-design/icons';
import {Checkbox} from "antd";

async function saveDocument({editor, navigate, title, policyId}){
    if (!editor) {
    alert('Editor not initialized yet!');
    return;
  }
    const content = editor.getJSON()

    const data ={
        name : title,
        content : content,
        userId: "Michele",
        docId: policyId,
    }

    try {
        const response = await fetch("http://16.171.14.0:8000/saved-docs", {   //http://127.0.0.1:8000/saved-docs", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(data),
        })

        if (response.ok) {
            console.log("Document saved")
            alert("Document was successfully saved")

            console.log("Invalidating...");
            await queryClient.invalidateQueries({queryKey: ["list_documents"]})
            navigate("/my-policies")

        } else {
            console.error("Failed to save document")
            alert("Error in saving document")
        }
    }catch(error){
        console.error("Error", error)
        alert("Network error in connecting")
    }
}

function ToolBar({editor, fileInputRef}) {
    /**
     * FUNCTION USED TO CONFIGURE THE LAYOUT/FUNCTIONALITIES OF THE MENU BAR
     */
    if (!editor) {
    alert('Editor not initialized yet!');
    return;
  }//If the editor is not present, then it does not load

    const editorState = useEditorState( {
        editor,
        selector: context => {
            return{
                //Fonts styles??
                isBold: context.editor.isActive("bold") ?? false,// The ?? ensures that the right-hand option is picked if the condition returns null or undefined
                isItalic: context.editor.isActive('italic') ?? false,
                isStrike: context.editor.isActive("strike") ?? false,
                isUnderline: context.editor.isActive("underline") ??false,

                // Paragraphs
                isLeft: context.editor.isActive({textAlign: "left"}) ?? false,
                isCenter: context.editor.isActive({textAlign: "center"}) ?? false,
                isRight: context.editor.isActive({textAlign: "right"}) ?? false,
                isJustified: context.editor.isActive({textAlign: "justify"}) ?? false,

                //Lists
                isOrderedList: context.editor.isActive("orderedList") ?? false,
                isBulletList: context.editor.isActive('bulletList') ?? false,
            }// selector is a function that receives a context object, where you can pick parts of the editor state you want to track.
        }
    })

    return(
        <div className="tool-bar">

            <div className="button-group">{/* Font styles*/}
                <button  onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`toolbar-btn ${editorState.isBold ? " is-active" : ""}`}
                        title="Bold"><FaBold/>
                </button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`toolbar-btn ${editorState.isItalic ? " is-active" : ""}`}
                        title="Italics"><FaItalic/>
                </button>
                <button onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`toolbar-btn ${editorState.isUnderline ? " is-active" : ""}`}
                        title="Underline"><FaUnderline/>
                </button>
                <button onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`toolbar-btn ${editorState.isStrike ? " is-active" : ""}`}
                        title="Strikethrough"><FaStrikethrough/>
                </button>
            </div>

            <div className="button-group">{/*Text alignment*/}
                <button onClick={() => editor.chain().focus().toggleTextAlign('left').run()}
                    className={`toolbar-btn ${editorState.isLeft ? " is-active" : ""}`}
                    title="Left alignment">
                <FaAlignLeft/> {/*TODO when it is left, I want it to toggle to justified and back (like word does)}*/}
                </button>
                <button onClick={() => editor.chain().focus().toggleTextAlign('center').run()}
                        className={`toolbar-btn ${editorState.isCenter ? " is-active" : ""}`}
                        title="Center"><FaAlignCenter/>
                </button>
                <button onClick={() => editor.chain().focus().toggleTextAlign('right').run()}
                        className={`toolbar-btn ${editorState.isRight ? "is-active" : ""}`}
                        title="Right alignment"><FaAlignRight/>
                </button>
                <button onClick={() => editor.chain().focus().toggleTextAlign('justified').run()}
                        className={`toolbar-btn ${editorState.isJustified ? " is-active" : ""}`}
                        title="Justify"><FaAlignJustify/>
                </button>
                {/* TODO text-align: justify doesn’t work together with white-space: pre-wrap in Firefox*/}
            </div>

            <div className="button-group">{/*Lists*/}
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`toolbar-btn ${editorState.isOrderedList ? " is-active" : ""}`}
                    title="Ordered list"><FaListOl/>
                </button>
                <button onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`toolbar-btn ${editorState.isBulletList ? " is-active" : ""}`}
                        title="Bullet list"><FaListUl/>
                </button>
            </div>

            <div className="button-group">{/*Image upload*/}
                <button className = "toolbar-btn" onClick={() => fileInputRef.current?.click()}
                    title="Upload image"><FaImage/>
                </button>
            </div>
        </div>
    )
}

function handleImageUpload(event,editor) {
    /**
     * FUNCTION USED TO UPLOAD THE IMAGE
     */
    const file = event.target.files[0]
    if (!file) return null

    const url= URL.createObjectURL(file)
    editor.chain().focus().setImage({src:url}).run()
    event.target.value= null // To clear the input
}

function Recommendations({editor}) {
    const [suggest, setSuggest] = useState("")
    const options = ["Policy A", "Policy B", "Policy C"]
    const [selectedOptions, setSelectedOptions] = useState([])

    async function fetchSuggestions() {
        const text = editor.getText();
        console.log({text})
        try {
          //  const response = await axios.post("http://127.0.0.1:8000/coverage_evaluator", {text: text});
            const response = await axios.post("http://16.171.14.0:8000/coverage_evaluator", {text: text});
            const suggestion = response?.data?.suggestion ||"None from server" ;

            if (suggestion) { //i.e. if it is not undefined/null
                console.log(" Suggestion returned from server:", suggestion)
            } else {
                console.warn("No suggestion returned from server")
            }
            setSuggest(suggestion)
            } catch (err) {
                console.error("Error fetching suggestion from AI:", err)
                setSuggest("Error Fetching")
        }
}

    return(
    <div className= "recom-window">
         <div className= "recom-window-1">
             {/*<h3> Recommended Policies </h3>*/}
            <button className="curved-btn" onClick={()=> fetchSuggestions()}>Check policies </button>
         </div>

        <div style={{ backgroundColor:"#ffffffff", borderRadius: "10px",padding: "10px 10px"}}>
            <p style={{fontWeight:550, fontSize:15}}> Policies to include</p>

            <Checkbox.Group
                value={selectedOptions}
                onChange={(item)=>setSelectedOptions(item)}
                style={{display:"flex", flexDirection:"column", gap:14, paddingTop:10}}>

                {options.map((item) => (
                    <label className={`checkbox ${selectedOptions.includes(item) ? "selected" : ""}`}
                         key={item} >
                        <Checkbox value={item} style={{fontSize:16, fontWeight:500}}>{item}</Checkbox>
                    </label>
))}
            </Checkbox.Group>
            {/*<TogglePanel content={suggest}/>*/}

        </div>
    </div>)
}

function TextEditor() {
    /**
     * FUNCTION WITH EVERYTHING RELATED TO EDITING THE TEXT: Menu-bar, image-upload, the editor page
     */
    const [title,setTitle] = useState("")
    const navigate = useNavigate()

       //CREATING THE EDITOR INSTANCE
    const editor = useEditor({
        content:  "",
        extensions: [
            StarterKit, Highlight, Color, Image,
            TextAlign.configure ({
                types: ["heading","paragraph"], alignments: ['left', 'center', 'right', 'justify'] //'cuz you must enable justified otherwise it (justified) won't work
            }),
        ],
        }); //It initializes the editor and returns an editor instance you can use to control the editor. IT MAKES SENSE!
        //Just like you can write a = function(b,c); it gives you the return of that statement

    //TO CONNECT THE IMAGE BUTTON WITH THE INPUT IMAGE FUNCTIONALITY
    const fileInputRef = useRef(null)

    //TO LOAD THE POLICY WE ARE EDITING
    const { policyId} = useParams()
    console.log(policyId)
    const{ data: policy, isLoading, isError, error } =  useQuery({
        queryKey: ["list_documents"],
        enabled: !!policyId, //Only run if policyId exists
        staleTime: 1000,
        queryFn: async () => {
          //  const response = await fetch(`http://127.0.0.1:8000/edit-document/${policyId}`)
            const response = await fetch(`http://16.171.14.0:8000/edit-document/${policyId}`)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
    });

    useEffect(() => { //May need to also check for
        if (policyId && policy) {
        setTitle(policy.name);
        editor.commands.setContent(policy.content || '')}
    }, [policyId, policy, editor]);

    if (isError) return <p>Error: {error.message}</p>
    if (isLoading) return <p>Loading...</p>

    return (
        <div style={{paddingLeft:30, overflowX:"auto"}}>

            {/*  THE HEADER*/}
            <div className="header">
                <div>
                    <Link to="/my-policies"
                          style={{
                              display: "flex",
                              gap: 10,
                              alignItems: "center",
                              color: "#6B7280FF",
                              backgroundColor: "transparent",
                              padding: "0px 4px 30px",
                              textDecoration: "none",
                              fontSize: "13px",
                              fontWeight: 600
                          }}>
                        <LeftOutlined style={{fontSize: 20}}/>
                        Back to My Policies
                    </Link>
                    <div>
                        <input
                            type="text"
                            placeholder="Click to add title"
                            className="editor-title"
                            value={title || ""}
                            onChange={e => setTitle(e.target.value)}
                        />

                        {(policyId ? (
                            <p style={{padding: "7px 0", fontSize: 13, color: "#6b7280"}}>Last
                                Updated: {new Date(policy.LastUpdatedAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour12: false,
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}{' • '}By {policy.userId} </p>) : <p></p>)}

                    </div>
                </div>

                    {/*  SAVE BUTTON  */}
                <div className="save-buttons">
                    <button className="curved-btn-white">Preview</button>
                    <button className="curved-btn"
                                onClick={() => saveDocument({editor, navigate, title, policyId})}>
                            ✓ Save & Close
                    </button>
                </div>
            </div>

            {/*  THE MAIN BODY  */}
            <div className="editor-policies">

                <div className="editor-container">
                    <ToolBar editor={editor} fileInputRef={fileInputRef}/>
                    <div className="editor-box-container" onClick={() => editor?.commands.focus()}> {/*This OnClick ensures that
                wherever I click on the blank page, it "focuses" on the editor. i.e. I can write in the editor"*/}
                        <EditorContent editor={editor} className="editor"/>
                    </div>
                </div>

                <div>
                    <Recommendations editor={editor}/>
                </div>
            </div>

            {/*hidden input file*/}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(event) => handleImageUpload(event, editor)}
                    style={{display: "none"}}
                />
                {/*//The file input is hidden (display: none), so the user can’t click it directly*/}
            </div>
    )
}

export default function PolicyWriter() {
    return (
                <TextEditor/>

    );
}

// function TogglePanel({content}) {
//     const [isOpen,setIsOpen] = useState(true)
//     const toggleSection = () => {
//         setIsOpen(!isOpen)
//     }
// //     setIsOpen(prev => ({
// //   ...prev,            // copy all previous keys
// //   [index]: !prev[index]  // toggle just this one
// // }));
//     return (
//         <div style={{borderRadius: "10px", padding: "10px 10px", border: "1px solid #ccc"}} >
//             <h4 onClick={toggleSection}>
//                 {isOpen ? '▼' : '▶'} Document 1
//             </h4>
//             {isOpen? <div> {content}</div> : null}
//         </div>)
// }
