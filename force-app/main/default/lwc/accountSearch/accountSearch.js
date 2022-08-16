import { LightningElement } from 'lwc';
import {loadScript} from "lightning/platformResourceLoader";
import JSPDF from '@salesforce/resourceUrl/jspdf';
import getAllNotes from '@salesforce/apex/AccountNotesController.getAllNotes';

export default class AccountSearch extends LightningElement {
    notesList = [];
    notesExist = false;
    accountName;

    pageNumber = 0;
    pageData = [];

    headers = this.createHeaders([
        "Title",
        "Body",
        "OwnerName",
        "ObjectType"
    ]);

    renderedCallback() {
        Promise.all([
            loadScript(this, JSPDF).then(()=>{
            })
        ]);
    }

    generatePdf(){
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF(
            {
                orientation: 'l'
            }
        );

        doc.text('Notes Related to Account: ' + this.accountName, 20, 20);
        doc.table(30, 30, this.notesList, this.headers, { autosize:true });
        doc.save("demo.pdf");
    }

    createHeaders(keys) {
        let result = [];
        for (let i = 0; i < keys.length; i += 1) {
            result.push({
                id: keys[i],
                name: keys[i],
                prompt: keys[i],
                width: 65,
                align: "center",
                padding: 0
            });
        }
        return result;
    }

    handleSearch(event) {
        getAllNotes({ accountId : event.target.value })
            .then((result) => {
                this.notesExist = true;
                let notesArray = [];
                result.forEach(record => {                 
                    let note = {};
                    note.Title = record.Title;
                    note.Body = record.Body;
                    note.OwnerName = record.Owner.Name;
                    if(record.Parent.Id.startsWith('001')){
                        this.accountName = record.Parent.Name;
                        note.ObjectType = 'Account';
                    }else{
                        note.ObjectType = 'Contact';
                    }
                    notesArray.push(note);
                });

                this.notesList = notesArray;  
            }).then((result) => {
                this.updatePage();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // Set current page state
    updatePage() {
        this.pageData = this.notesList.slice(this.pageNumber*10, this.pageNumber*10+10);
    }

    // Back a page
    previous() {
        this.pageNumber = Math.max(0, this.pageNumber - 1);
        this.updatePage();
    }
    // Back to the beginning
    first() {
        this.pageNumber = 0;
        this.updatePage();
    }
    // Forward a page
    next() {
        this.pageNumber = Math.min(Math.floor((this.notesList.length-9)/10), this.pageNumber + 1);
        this.updatePage();
    }
    // Forward to the end
    last() {
        this.pageNumber = Math.floor((this.notesList.length-9)/10);
        this.updatePage();
    }
}