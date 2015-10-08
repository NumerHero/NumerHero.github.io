// Ϊ����webkit����� �޸ı���ΪGBK
function draweffect( obj )
{

	var effect = [];
	obj.effect ? effect = obj.effect : effect[0] = 'default'; 
	var x = obj.x || 0;
	var y = obj.y || 0;
	var MosaicValue = obj.MosaicValue || 5;
	if(!obj.ImageSrc)
	{
		console.log( '%c ����������ͼƬ����Դ:' , 'background:red; color:white;' );
		console.log( '%c �ڶ���������� ImageSRc : "ͼƬ·��" ' , 'background:#edc; color:yellow;'); 
		return;
	}

	var yImg = new Image();
	yImg.src = obj.ImageSrc;
	
	oCanvas.width = yImg.width;
	oCanvas.height = yImg.height;
	oGc.drawImage( yImg , x , y );
	
	var w = yImg.width;
	var h = yImg.height; 
	yImg.onload = function(){

		for(var t = 0 ; t<effect.length ; t++)
		{
			switch( true )
			{
				case effect[t] == 'default':
				break;

				//��ɫ
				case effect[t] == 'inverseColor':
				var oImg = oGc.getImageData( x , y , yImg.width , yImg.height );
				for( var i = 0 ; i<h ; i++ )
				{
					for( var j = 0 ; j<w ; j++ )
					{
						var result = [];
						var color = getXY( oImg , j , i );

						result[0] = 255 - color[0];
						result[1] = 255 - color[1];
						result[2] = 255 - color[2];
						result[3] = color[3];
						setXY( oImg , j , i ,result );
					}
				}
				oGc.putImageData( oImg , x , y );
				break;

				//��ֱ���򽥱�
				case effect[t] == 'GradientX':
				var oImg = oGc.getImageData( x , y , yImg.width , yImg.height );
				for( var i = 0 ; i<h ; i++ )
				{
					for( var j = 0 ; j<w ; j++ )
					{
						var result = [];
						var color = getXY( oImg , j , i );

						result[0] = color[0];
						result[1] = color[1];
						result[2] = color[2];
						result[3] = 255*i/h;
						setXY( oImg , j , i ,result );
					}
				}
				oGc.putImageData( oImg , x , y );
				break;

				//ˮƽ���򽥱�
				case effect[t] == 'GradientY':
				var oImg = oGc.getImageData( x , y , yImg.width , yImg.height );
				for( var j = 0 ; j<w ; j++ )
				{
					for(  var i = 0 ; i<h ; i++)
					{
						var result = [];
						var color = getXY( oImg , j , i );

						result[0] = color[0];
						result[1] = color[1];
						result[2] = color[2];
						result[3] = 255*j/h;
						setXY( oImg , j , i ,result );
					}
				}
				oGc.putImageData( oImg , x , y );
				break;

				//ͼƬȡ��
				case effect[t] == 'invertedImage':
				var oImg = oGc.getImageData( x , y , yImg.width , yImg.height );
				var newImage = oGc.createImageData(yImg.width , yImg.height);
				for( var i = h ; i>0 ; i-- )
				{
					for( var j = 0 ; j<w ; j++ )
					{
						var result = [];
						var color = getXY( oImg , j , i );

						result[0] = color[0];
						result[1] = color[1];
						result[2] = color[2];
						result[3] = color[3];
						setXY( newImage , j , h - i ,result );
					}
				}
				oGc.putImageData( newImage , x , y );
				break;

				//������
				case effect[t] == 'MosaicImage':
				var oImg = oGc.getImageData( x , y , yImg.width , yImg.height );
				var newMosaicImage = oGc.createImageData(yImg.width,yImg.height);


				var stepW = Math.floor(w/MosaicValue);
				var stepH = Math.floor(h/MosaicValue);

				for( var i = 0 ; i<stepH ; i++ )
				{
					for( var j = 0; j<stepW ; j++)
					{
						//ÿһ�� MosaicValue*MosaicValue �����ȡһ��С������ص���ɫ ���������ɫ�����������������ظ�ֵ
						var color = getXY( oImg , j*MosaicValue + Math.floor(Math.random()*MosaicValue) , i*MosaicValue + Math.floor(Math.random()*MosaicValue) );
						
						for( var k = 0 ; k<MosaicValue ; k++ )
						{
							for( var l = 0 ; l<MosaicValue ; l++ )
							{
								setXY( newMosaicImage , j*MosaicValue+l , i*MosaicValue+k , color );
							}
						}


					}
				}
				oGc.putImageData( newMosaicImage , x , y );
				break;
			}	
		}
	}
	
	

	/* ���ú��� */
	function setXY( obj , x , y  , color )
	{
	  var w = obj.width;
	  var h = obj.height;
	  var d = obj.data;

	  d[4*(y*w+x)] = color[0];
	  d[4*(y*w+x)+1] = color[1];
	  d[4*(y*w+x)+2] = color[2];
	  d[4*(y*w+x)+3] = color[3];
	}

	function getXY( obj , x , y )
	{
	  var w = obj.width;
	  var h = obj.height;
	  var d = obj.data;

	  var color = [];
	  
	  color[0] = d[4*(y*w+x)];
	  color[1] = d[4*(y*w+x)+1];
	  color[2] = d[4*(y*w+x)+2];
	  color[3] = d[4*(y*w+x)+3];

	  return color;
	}
}	