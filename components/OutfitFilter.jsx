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
        <View style={{ marginBottom: 10 }}>
            <View style={styles.row}>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedType}
                        onValueChange={itemValue => setSelectedType(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item style={styles.pickerItem} label="All Types" value="" />
                        {outfitItems.length > 0 && (
                            uniqueTypes.map(type => (
                                <Picker.Item style={styles.pickerItem} key={type} label={type.charAt(0).toUpperCase() + type.slice(1)} value={type} />
                            ))
                        )}
                    </Picker>
                </View>

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedStyle}
                        onValueChange={itemValue => setSelectedStyle(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item style={styles.pickerItem} label="All Styles" value="" />
                        {outfitItems.length > 0 && (
                            uniqueStyles.map(style => (
                                <Picker.Item style={styles.pickerItem} key={style} label={style.charAt(0).toUpperCase() + style.slice(1)} value={style} />
                            ))
                        )}
                    </Picker>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedColor}
                        onValueChange={itemValue => setSelectedColor(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item style={styles.pickerItem} label="All Colors" value="" />
                        {outfitItems.length > 0 && (
                            uniqueColors.map(color => (
                                <Picker.Item style={styles.pickerItem} key={color} label={color.charAt(0).toUpperCase() + color.slice(1)} value={color} />
                            ))
                        )}
                    </Picker>
                </View>

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedSeason}
                        onValueChange={itemValue => setSelectedSeason(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item style={styles.pickerItem} label="All Seasons" value="" />
                        {outfitItems.length > 0 && (
                            uniqueSeasons.map(season => (
                                <Picker.Item style={styles.pickerItem} key={season} label={season.charAt(0).toUpperCase() + season.slice(1)} value={season} />
                            ))
                        )}
                    </Picker>
                </View>
            </View>
        </View>
    );

});

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    pickerContainer: {
        flex: 1,
        marginHorizontal: 3,

    },
    picker: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    pickerItem: {
        fontSize: 14,
    },
});

export default OutfitFilter;