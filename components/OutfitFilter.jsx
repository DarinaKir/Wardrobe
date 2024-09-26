import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // ייבוא מהחבילה החדשה

const OutfitFilter = React.forwardRef(({ outfitItems, onFilter }, ref) => {
    const [selectedType, setSelectedType] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSeason, setSelectedSeason] = useState('');

    // מציאת הערכים הייחודיים ב-outfitItems
    const uniqueTypes = outfitItems.length > 0 ? [...new Set(outfitItems.map(item => item.type))] : [];
    const uniqueStyles = outfitItems.length > 0 ? [...new Set(outfitItems.map(item => item.style))] : [];
    const uniqueColors = outfitItems.length > 0 ? [...new Set(outfitItems.map(item => item.color))] : [];

    // מציאת העונות הייחודיות, כאשר עונות המופרדות ב- '/' יטופלו בנפרד
    const getUniqueSeasons = (items) => {
        const seasonsSet = new Set();

        items.forEach(item => {
            if (item.season) {
                const seasons = item.season.split('/'); // מפריד את העונות
                seasons.forEach(season => seasonsSet.add(season.trim())); // מוסיף עונה לרשימה בלי רווחים
            }
        });

        return Array.from(seasonsSet); // מחזיר את העונות כ-array ייחודי
    };

    const uniqueSeasons = outfitItems.length > 0 ? getUniqueSeasons(outfitItems) : [];

    // סינון אוטומטי כשברירת מחדל בעת הטעינה של הקומפוננטה
    useEffect(() => {
        if (outfitItems.length > 0){
            handleFilter();
        }
    }, [selectedType, selectedStyle, selectedColor, selectedSeason, outfitItems]);

    const handleFilter = () => {
        const filteredItems = outfitItems.filter(item => {
            return (
                (selectedType ? item.type === selectedType : true) &&
                (selectedStyle ? item.style === selectedStyle : true) &&
                (selectedColor ? item.color === selectedColor : true) &&
                (selectedSeason ? item.season && item.season.split('/').includes(selectedSeason) : true)
            );
        });
        // console.log("Filtered Items: ", filteredItems); // הוסף שורה זו
        onFilter(filteredItems);
    };

    // רפרנס לפונקציית איפוס הסינון
    React.useImperativeHandle(ref, () => ({
        resetFilters() {
            setSelectedType('');
            setSelectedStyle('');
            setSelectedColor('');
            setSelectedSeason('');
        }
    }));

    return (
        <View style={styles.container}>
            <Picker
                selectedValue={selectedType}
                onValueChange={itemValue => setSelectedType(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="All Types" value="" />
                {outfitItems.length > 0 && (
                    uniqueTypes.map(type => (
                        <Picker.Item key={type} label={type.charAt(0).toUpperCase() + type.slice(1)} value={type} />
                    ))
                )}
            </Picker>

            <Picker
                selectedValue={selectedStyle}
                onValueChange={itemValue => setSelectedStyle(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="All Styles" value="" />
                {outfitItems.length > 0 && (
                    uniqueStyles.map(style => (
                        <Picker.Item key={style} label={style.charAt(0).toUpperCase() + style.slice(1)} value={style} />
                    ))
                )}
            </Picker>

            <Picker
                selectedValue={selectedColor}
                onValueChange={itemValue => setSelectedColor(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="All Colors" value="" />
                {outfitItems.length > 0 && (
                    uniqueColors.map(color => (
                        <Picker.Item key={color} label={color.charAt(0).toUpperCase() + color.slice(1)} value={color} />
                    ))
                )}
            </Picker>

            <Picker
                selectedValue={selectedSeason}
                onValueChange={itemValue => setSelectedSeason(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="All Seasons" value="" />
                {outfitItems.length > 0 && (
                    uniqueSeasons.map(season => (
                        <Picker.Item key={season} label={season.charAt(0).toUpperCase() + season.slice(1)} value={season} />
                    ))
                )}
            </Picker>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        padding: 16, // ריווח פנימי
        backgroundColor: '#f9f9f9', // צבע רקע בהיר
        borderRadius: 8, // פינות מעוגלות
        shadowColor: '#000', // צבע הצל
        shadowOffset: { width: 0, height: 2 }, // מיקום הצל
        shadowOpacity: 0.1, // שקיפות הצל
        shadowRadius: 4, // רדיוס הצל
        elevation: 2, // למכשירים אנדרואיד
        marginBottom: 10,
    },
    picker: {
        height: 50, // גובה ה-Picker
        width: '100%', // רוחב מלא
        marginBottom: 12, // ריווח בין ה-Pickers
        borderWidth: 1, // גבול
        borderColor: '#ccc', // צבע הגבול
        borderRadius: 5, // פינות מעוגלות לגבול
        backgroundColor: '#fff', // צבע רקע של ה-Picker
    },
});

export default OutfitFilter;