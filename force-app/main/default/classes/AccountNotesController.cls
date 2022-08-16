/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 08-16-2022
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class AccountNotesController {
    public AccountNotesController() {

    }

    @AuraEnabled
    public static List<Note> getNotesfromAccount(String accountId){
        try {
            List<Note> noteList = new List<Note>();
            noteList = [SELECT Title, Body, Owner.Name, Parent.Name 
                        FROM Note 
                        WHERE parentId = :accountId 
                        ORDER BY CreatedDate];
            return noteList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static List<Note> getNotesfromContacts(String accountId) {
        List<Contact> listContacts = new List<Contact>();
        listContacts = [SELECT Id 
                        FROM Contact 
                        WHERE AccountId = :accountId];

            Set<Id> contactIds = new Set<Id>();
        for (Contact currentContact : ListContacts){
            contactIds.add(currentContact.Id);
        }

        List<Note> noteList = new List<Note>();
            noteList = [SELECT Title, Body, Owner.Name, Parent.Name 
                        FROM Note 
                        WHERE parentId IN :contactIds 
                        ORDER BY CreatedDate];

        return noteList;
        
    }
    @AuraEnabled
    public static List<Note> getAllNotes(String accountId) {
        List<Note> allnotes = new List<Note>();
        allnotes.addAll(getNotesfromAccount(accountId));
        allnotes.addAll(getNotesfromContacts(accountId));

        return allnotes;
    }
}
