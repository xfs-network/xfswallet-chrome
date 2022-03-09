
import localforage from "localforage";

const KEY_PAGE_STATE = 'page_state';

class ExtraDB {
    constructor(dbname){
        this.dbname = dbname;
        this.db = localforage.createInstance({
            name: dbname,
            driver: localforage.INDEXEDDB,
        });
    }
    setPageState(state) {
        return this.db.setItem(KEY_PAGE_STATE, state);
    }
    getPageState(){
        return this.db.getItem(KEY_PAGE_STATE);
    }
    async popPageState(){
        const state = await this.db.getItem(KEY_PAGE_STATE);
        await this.setPageState(false);
        return state;
    }
    dropDB(){
        return this.db.dropInstance();
    }
}
export default ExtraDB;