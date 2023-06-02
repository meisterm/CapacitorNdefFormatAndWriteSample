import { Component } from '@angular/core';
import { CapacitorNfcService } from './capacitor-nfc.service';
import { map } from 'rxjs';
import { NdefMessage, NdefRecord, NfcTag, NfcUtils, UriIdentifierCode } from '@capawesome-team/capacitor-nfc';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private nfc: CapacitorNfcService) {

  }

  public writeNfc() {


    this.nfc.scannedTag$
    .pipe(
      map(async (x : NfcTag) => {

        console.log('Formatting Tag...');
        await this.nfc.format();
        console.log('Formatted!');

        const nfcUtils = new NfcUtils();
        let records: NdefRecord[] = [];
        
        const uriRecord = nfcUtils.createNdefUriRecord({ 
          uri : 'example.com',
          identifierCode: UriIdentifierCode.Https
        });

        records.push(uriRecord.record);

        let msg : NdefMessage = {
          records : records
        };      

        console.log('Writing Tag...');

        await this.nfc.write({
          message: msg
        });

        console.log('Tag written');
        console.log('Stopping Scan Session...');
        await this.nfc.stopScanSession();
        console.log('Session stopped!');

        return true;
      })).subscribe(x => {

      });



      console.log('Starting Scan Session...');
      this.nfc.startScanSession();
  }
}
