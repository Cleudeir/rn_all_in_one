import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import * as Progress from 'react-native-progress';

type Props = {
  downloadUrl: string;
  progress: {id: number; percent: number}[];
  setProgress: React.Dispatch<
    React.SetStateAction<{id: number; percent: number}[]>
  >;
};
const VideoDownloader = ({downloadUrl, progress, setProgress}: Props) => {
  console.log('progress: ', JSON.stringify(progress, null, 2));
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const checkPermission = async (): Promise<boolean> => {
    try {
      const permissionToRequest =
        Platform.Version >= '33'
          ? PERMISSIONS.ANDROID.READ_MEDIA_VIDEO // For Android 13+
          : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE; // For Android 12 and below

      const result = await request(permissionToRequest);

      switch (result) {
        case RESULTS.GRANTED:
          return true;
        case RESULTS.DENIED:
          Alert.alert(
            'Permission Required',
            'Storage permission is required to download videos.',
          );
          return false;
        case RESULTS.BLOCKED:
          Alert.alert(
            'Permission Blocked',
            'Please enable storage permission from settings.',
          );
          return false;
        default:
          return false;
      }
    } catch (err) {
      console.error('Permission check error:', err);
      return false;
    }
  };

  useEffect(() => {
    const requestPermission = async () => {
      const permissionGranted = await checkPermission();
      setHasPermission(permissionGranted);
    };

    requestPermission();
  }, []);

  const downloadVideo = async () => {
    if (!downloadUrl || !hasPermission) {
      return;
    }
    const query = decodeURI(downloadUrl).split('?')[1];
    const itens = query.split('&');

    const findItem = (item: string) => {
      const result = itens.find(it => it.includes(item));
      return result ? result.split('=')[1] : '';
    };
    // replace all espial characters to avoid errors
    const name = findItem('title').replace(/[^a-zA-Z0-9]/g, '_');
    const midiaType = findItem('mime');
    const extension = midiaType.includes('audio') ? 'mp3' : 'mp4';
    console.log('name: ', JSON.stringify({name, extension}, null, 2));

    const fileSave = `${RNFS.DownloadDirectoryPath}/${name}.${extension}`;
    const id = progress.length + 1;
    setProgress((e: any) => [...e, {id, percent: 0}]);

    const downloadOptions = {
      fromUrl: downloadUrl,
      toFile: fileSave,
      progressDivider: 1,
      begin: () => console.log('Download started.'),
      progress: (res: {contentLength: number; bytesWritten: number}) => {
        const percent = res.bytesWritten / res.contentLength;
        const _progress = [...progress];
        const newPressState = {id, percent};
        const index = _progress.findIndex(item => item.id === id);
        if (index !== -1) {
          _progress[index].percent = percent;
          setProgress(_progress);
        } else {
          _progress.push(newPressState);
          setProgress(_progress);
        }
      },
    };

    try {
      // check if the file already exists
      const fileExists = await RNFS.exists(fileSave);
      console.log('fileExists: ', JSON.stringify(fileExists, null, 2));
      if (fileExists) {
        Alert.alert(
          'Download Completed',
          'Video downloaded and saved successfully.',
        );
      } else {
        await RNFS.downloadFile(downloadOptions).promise;
        Alert.alert(
          'Download Completed',
          'Video downloaded and saved successfully.',
        );
        setProgress((e: any) => e.filter((item: any) => item.id !== id));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to download video.');
      console.error(err);
    } finally {
      setProgress((e: any) => e.filter((item: any) => item.id !== id));
    }
  };

  useEffect(() => {
    if (downloadUrl && hasPermission) {
      downloadVideo();
    }
  }, [downloadUrl, hasPermission]);

  const style: any = {
    display: progress.length === 0 ? 'none' : 'flex',
  };
  const width = Dimensions.get('window').width;
  return (
    <View style={[styles.balloon, style]}>
      <ScrollView>
        {progress.length
          ? progress.map((item, i) => (
              <View key={String(i + Math.random())} style={styles.ContainerBar}>
                <Progress.Bar
                  progress={item.percent}
                  width={width}
                  height={5}
                  color={i % 2 === 0 ? '#d36868' : '#55da55'}
                  borderRadius={0}
                />
              </View>
            ))
          : null}
      </ScrollView>
    </View>
  );
};

export default VideoDownloader;

const styles = StyleSheet.create({
  balloon: {
    width: '100%',
    backgroundColor: '#fff',
    elevation: 5,
  },
  progressText: {
    marginHorizontal: 5,
    fontSize: 14,
  },
  ContainerBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
