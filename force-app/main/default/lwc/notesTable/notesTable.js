import { LightningElement, api } from 'lwc';

const columns = [
    { label: 'Title', fieldName: 'Title' },
    { label: 'Body', fieldName: 'Body'},
    { label: 'Owner Name', fieldName: 'OwnerName'},
    { label: 'Object Type', fieldName: 'ObjectType'},
   ];

export default class NotesTable extends LightningElement {
    @api notesList;
    columns = columns;
}
