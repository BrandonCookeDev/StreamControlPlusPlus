import fs from 'fs';
import path from 'path';

export default class FileUtil implements FileUtil.IFileUtil{

	static initialized: boolean = false
	static instance: FileUtil

	static getInstance(){
		if(!FileUtil.initialized)
			FileUtil.instance = new FileUtil;
		return FileUtil.instance;
	}

	writeSCFile(data: Object): void {
		
	}

}

namespace FileUtil{
	export interface IFileUtil{
		writeSCFile(data: Object): void
	}
}