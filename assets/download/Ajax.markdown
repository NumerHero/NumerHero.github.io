function ajax( method , data , url , success , faild )   
{
  // �����β�ȱʡֵ
  method = method || 'get';
  data = data || undefined;
  url = url || undefined
  success = success || undefined;
  faild = faild || undefined;
  
  //data ��JSON��ʽ���ݹ���
  try
  {
    var xhr =  new XMLHttpRequest();
  }
  catch(e)
  {
    var xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }

  if(method.toLowerCase() == "post")
  {
    xhr.open( 'post' , url , true );
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    //��post������Ҫ��send�������ݲ���ʱ��
    xhr.send(data);
  }
  else if(method.toLowerCase() == "get")
  {
    isData();
    xhr.open( 'get' , url , true );
    xhr.send(null);
  }
  else
  {
    alert("�����ѡ��ķ����������,���޸Ľű�");
    return;
  }
  
  xhr.onreadystatechange = function()
  {
    if(xhr.readyState == 4 && xhr.status == 200)
    {
      if(success)
      {
        success( xhr.responseText );
      }
      else
      {
        faild && faild();
      }
    }
  }

  function isData()
  {
    if(data)
    {
      if( typeof(data) != 'object')
      {
        //��data�������������͵�ʱ��
        //(�����������ַ����δ��Σ����ұ�֤����url��ʽ��Ȼ�������)
        url = url + '?' +��data + new Date().getTime();
      }
      else
      {
        //��data��JSON��ʱ��
        for(i in data)
        {
          // ����� i ���Ǳ�������������� data[i] �����Ե�ֵ
          url = addURLParam(url , i , data[i]);
        }

        url += new Date().getTime();
      }  
    }
  }

  function addURLParam(url , name , value)
  {
    //����url�ַ��� �ж��Ƿ���?�ַ� ���û�� �����һ��?�ַ� ������ż�����
    //����Ѿ����� ˵����Ҫ��ӵĲ��ǵ�һ��������
    //��ʱ��ͼ�һ��&�����ٸ���������

    url += (url.indexOf("?") == -1 ? "?" : "&");
    
    //encodeURIComponent()�������ڽ� ��url��׼�ַ���� 
    //�����ַ�תΪHTTP����
    
    url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
    return url;
  }
}