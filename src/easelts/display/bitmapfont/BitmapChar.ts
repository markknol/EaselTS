import Sprite = require('../Sprite');

class BitmapChar
{
	mTexture:Sprite;
	mCharId:number;
	mXOffset;
	mYOffset;
	mXAdvance;
	mKernings;

	constructor(id:number, texture:Sprite, xOffset:number, yOffset:number, xAdvance)
	{
		this.mTexture = texture;
		this.mCharId = id;
		this.mXOffset = xOffset;
		this.mYOffset = yOffset;
		this.mXAdvance = xAdvance;
		this.mKernings = null;
	}


	public addKerning(charId, amount)
	{
		if(this.mKernings == null)
		{
			this.mKernings = [];
		}

		this.mKernings[charId] = amount;
	}

	public getKerning(charId)
	{
		return (this.mKernings == null || this.mKernings[charId] == null || this.mKernings[charId] == undefined) ? 0 : this.mKernings[charId];
	}

	public createImage():Sprite
	{
		return this.mTexture.clone();
	}

	public getCharId()
	{
		return this.mCharId;
	}

	public getXOffset()
	{
		return this.mXOffset;
	}

	public getYOffset()
	{
		return this.mYOffset;
	}

	public getXAdvance()
	{
		return this.mXAdvance;
	}

	public getTexture():Sprite
	{
		return this.mTexture;
	}

	public getWidth()
	{
		return this.mTexture.spriteSheet.getFrame(this.mTexture.currentFrame).rect.width;
	}

	public getHeight()
	{
		return this.mTexture.spriteSheet.getFrame(this.mTexture.currentFrame).rect.height;
	}
}

export = BitmapChar;
